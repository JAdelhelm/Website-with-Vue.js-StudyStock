/**
 * Author: Julian Schuster
 * Websocket initialisierung mit socket.io für den Chat
 */
const crypto = require('crypto');
const fns = require('date-fns');
const moment = require('moment');
//Random ID erstellen für Session ID
const randomId = () => crypto.randomBytes(8).toString('hex')
const {
    InMemorySessionStore
} = require('./sessionStore')
const sessionStore = new InMemorySessionStore()
const {
    InMemoryMessageStore
} = require('./messageStore')
const messageStore = new InMemoryMessageStore()

// Startmethode Initialisieren die an `io` gesendet wird
module.exports = {
    start: function (io, con) {
        /**
         * Initialaufruf sobald ein Benutzer sich mit Websocket verbindet
         */
        io.use((socket, next) => {
            const sessionID = socket.handshake.auth.sessionID
            if (sessionID) {
                const session = sessionStore.findSession(sessionID)
                if (session) {
                    socket.sessionID = sessionID
                    socket.userID = session.userID
                    socket.username = session.username
                    return next()
                }
            }

            const username = socket.handshake.auth.username
            if (!username) {
                return next(new Error('invalid username'))
            }

            con.query(
                'SELECT id, name FROM benutzer WHERE name = "' + username + '"',
                function (err, result) {
                    if (err) throw err
                    socket.sessionID = randomId()
                    socket.userID = result[0].id
                    socket.username = username
                    next()
                },
            )
        })

        /**
         * Sobald ein Benutzer mit Websockt verbunden ist, wird er auf ein 'user'-Array geschrieben und allen anderen Benutzern bekannt gemacht
         * Nachrichten werden aus der DB geladen und im messageStore gespeichert
         */
        io.on('connection', (socket) => {
            console.log(socket.username + ' hat sich verbunden')

            var message = null;

            con.query(
                'SELECT id, receiver_id, sender_id, inhalt, gelesen, datum_geschrieben FROM nachricht WHERE receiver_id = ' +
                socket.userID + ' OR sender_id = ' + socket.userID,
                function (err, result) {
                    if (err) throw err

                    messageStore.clearMessages(); //Messages im messageStore clearen da jetzt alle Nachrichten aus der DB geladen werden

                    if (process.env.NODE_ENV == "prod") {
                        //Aus jedem Element eine message basteln die im messageStore gespeichert werden soll
                        result.forEach(element => {
                            message = {
                                id: element.id,
                                content: element.inhalt,
                                from: element.sender_id,
                                to: element.receiver_id,
                                read: element.gelesen,
                                time: moment(element.datum_geschrieben).add(2, 'hours').toISOString().replace(/T/, ' ').replace(/\..+/, '').split(" ")[1],
                            }
                            //Nachricht im messageStore speichern
                            messageStore.saveMessage(message);
                        });
                    } else {
                        //Aus jedem Element eine message basteln die im messageStore gespeichert werden soll
                        result.forEach(element => {
                            message = {
                                id: element.id,
                                content: element.inhalt,
                                from: element.sender_id,
                                to: element.receiver_id,
                                read: element.gelesen,
                                time: element.datum_geschrieben.toLocaleTimeString('de'),
                            }

                            //Nachricht im messageStore speichern
                            messageStore.saveMessage(message);
                        });
                    }

                    //Session speichern
                    sessionStore.saveSession(socket.sessionID, {
                        userID: socket.userID,
                        username: socket.username,
                        connected: true,
                    })

                    // emit Session details
                    socket.emit('session', {
                        sessionID: socket.sessionID,
                        userID: socket.userID,
                    })

                    //"userID" Raum beitreten
                    socket.join(socket.userID)

                    // Alle existierenden Benutzer fetchen und in Array 'users' speichern
                    const users = []
                    const messagesPerUser = new Map()
                    messageStore.findMessagesForUser(socket.userID).forEach((message) => {
                        const {
                            from,
                            to
                        } = message
                        const otherUser = socket.userID === from ? to : from
                        if (messagesPerUser.has(otherUser)) {
                            messagesPerUser.get(otherUser).push(message)
                        } else {
                            messagesPerUser.set(otherUser, [message])
                        }
                    })

                    con.query('SELECT id, name FROM benutzer', function (err, result) {
                        if (err) throw err
                        result.forEach((element) => {
                            users.push({
                                userID: element.id,
                                username: element.name,
                                connected: false,
                                messages: messagesPerUser.get(element.id) || [],
                            })
                        })

                        sessionStore.findAllSessions().forEach((session) => {
                            for (let i = 0; i < users.length; i++) {
                                if (users[i].username == session.username) {
                                    users[i].connected = true
                                }
                            }
                        })

                        //Array 'users' an alle verbundenen Clienten weiterleiten
                        socket.emit('users', users)

                        // Alle Verbundenen Benutzer auf einen neuen User hinweisen
                        socket.broadcast.emit('user connected', {
                            userID: socket.userID,
                            username: socket.username,
                            connected: true,
                            messages: [],
                        })
                    }, )
                })

            /**
             * Weiterleiten einer privaten Nachricht an den richtigen Empfänger
             */
            socket.on('private message', ({
                content,
                to,
                offerID,
                initialOfferUser
            }) => {
                const message = {
                    content,
                    from: socket.userID,
                    to,
                }

                //Wenn AngebotID nicht null ist und AngebotserstellerID mit dem ausgewählten Benutzer im Chat übereinstimmt, Anfrage senden
                if (offerID !== null && initialOfferUser == to) {
                    con.query(
                        "SELECT angebot.preis FROM angebot WHERE angebot.id ='" +
                        offerID +
                        "' ",
                        function (err, result) {
                            if (err) throw err
                            //Wenn angebot kostenpflichtig ist, eintrag in db machen
                            if (result[0].preis > 0) {
                                con.query(
                                    'INSERT INTO anfrage (user_id, angebot_id, bestaetigt) VALUES (?, ?, ?)',
                                    [socket.userID, offerID, 0],
                                    function (err, result) {
                                        if (err) {
                                            if (err.code === 'ER_DUP_ENTRY') {
                                                console.log('Downloadanfrage wurde bereits gesendet')
                                            }
                                        } else {
                                            console.log('1 record inserted')
                                            console.log('Downloadanfrage gesendet')
                                        }
                                    },
                                )
                            }

                        },
                    )
                }

                //Nachricht versenden
                socket.to(to).to(socket.userID).emit('private message', message)

                //gelesen default auf false
                let gelesen = false;

                //Wenn Nachricht an einen selber geschickt wird, gelesen true setzen
                if (to == socket.userID) {
                    gelesen = true
                }

                con.query(
                    'INSERT INTO nachricht (sender_id, receiver_id, inhalt, gelesen, datum_geschrieben) VALUES (?, ?, ?, ?, ?)',
                    [
                        socket.userID,
                        to,
                        content,
                        gelesen,
                        fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"),
                    ],
                    function (err, result) {
                        if (err) throw err
                    },
                )

                //Nachricht im messageStore speichern
                messageStore.saveMessage(message)
            })

            /**
             * Wenn ein Benutzer die Verbindung mit dem Websockt trennt -> alle Benutzer darauf hinweisen, dass sich dieser Nutzer disconnected hat
             */
            socket.on('disconnect', async () => {
                console.log(socket.username + ' disconnected')
                messageStore.messages = [];
                const matchingSockets = await io.in(socket.userID).allSockets()
                const isDisconnected = matchingSockets.size === 0
                if (isDisconnected) {
                    socket.broadcast.emit('user disconnected', socket.userID)
                    // Connection Status im sessionStore ändern
                    sessionStore.saveSession(socket.sessionID, {
                        userID: socket.userID,
                        username: socket.username,
                        connected: false,
                    })
                }
            })
        })
    }
}