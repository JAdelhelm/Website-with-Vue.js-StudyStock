var mysql = require('mysql');
const fns = require('date-fns');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "teamprojekt"
});

con.connect(function (err) {
    if (err) throw err;
    queryDatabase();
});

function queryDatabase() {
    con.query("DROP DATABASE teamprojekt;", function (err, result) {
        if (err) throw err;
        console.log("Database dropped");
    });

    con.query("CREATE DATABASE teamprojekt;", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });

    con.query("USE teamprojekt;", function (err, result) {
        if (err) throw err;
        console.log("using teamprojekt Database");
    });

    //Benutzer Tabelle erzeugen
    con.query('CREATE TABLE benutzer (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50), password VARCHAR(255), email VARCHAR(255), description VARCHAR(255), rolle BOOLEAN, datum_registration datetime, last_login datetime);',
        function (err, results, fields) {
            if (err) throw err;
            console.log('Created benutzer table.');
        })

    //Medium Tabelle erzeugen
    con.query('CREATE TABLE medium (id INT AUTO_INCREMENT PRIMARY KEY, user_id int(11), dateiname VARCHAR(255), pfad VARCHAR(255), thumbnailpfad VARCHAR(255), dateityp VARCHAR(255), metadaten VARCHAR(255), datum_hinzugefuegt datetime);',
        function (err, results, fields) {
            if (err) throw err;
            console.log('Created medium table.');
        })

    //Angebot Tabelle erzeugen
    con.query('CREATE TABLE angebot (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), name VARCHAR(255), description VARCHAR(255), item_id int(11) unique, preis FLOAT, kategorie VARCHAR(255), tags VARCHAR(255), lizenz VARCHAR(255), freigeschaltet BOOLEAN, datum_angebot datetime, reviews numeric(9), rating numeric(9,2), avg_rating numeric(9,2), rated TEXT);',
        function (err, results, fields) {
            if (err) throw err;
            console.log('Created angebot table.');
        })

    //Service Tabelle erzeugen
    con.query('CREATE TABLE service (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), name VARCHAR(255), description VARCHAR(255), kategorie VARCHAR(255), tags VARCHAR(255), pfad VARCHAR(255), freigeschaltet BOOLEAN, datum_angebot datetime, reviews numeric(9), rating numeric(9,2), avg_rating numeric(9,2), rated TEXT);',
        function (err, results, fields) {
            if (err) throw err;
            console.log('Created angebot table.');
        })

    //Anfrage Tabelle erzeugen
    con.query('CREATE TABLE anfrage (user_id int(11), angebot_id int(11), bestaetigt BOOLEAN, PRIMARY KEY(user_id, angebot_id));',
        function (err, results, fields) {
            if (err) throw err;
            console.log('Created anfrage table.');
        })

    //Download Tabelle erzeugen
    con.query('CREATE TABLE download (id INT AUTO_INCREMENT PRIMARY KEY, user_id int(11), item_id int(11), datum datetime);',
        function (err, results, fields) {
            if (err) throw err;
            console.log('Created download table.');
        })

    //Nachricht Tabelle erzeugen
    con.query('CREATE TABLE nachricht (id INT AUTO_INCREMENT PRIMARY KEY, sender_id int(11), receiver_id int(11), inhalt VARCHAR(255), gelesen BOOLEAN, datum_geschrieben datetime);',
        function (err, results, fields) {
            if (err) throw err;
            console.log('Created nachricht table.');
        })

    /* Fremdschluessel erzeugen */
    // con.query('ALTER TABLE `medium` ADD FOREIGN KEY (`user_id`) REFERENCES `benutzer` (`id`) ON DELETE CASCADE;');
    // con.query('ALTER TABLE `angebot` ADD FOREIGN KEY (`item_id`) REFERENCES `medium` (`id`) ON DELETE CASCADE;');
    // con.query('ALTER TABLE `anfrage` ADD FOREIGN KEY (`user_id`) REFERENCES `benutzer` (`id`) ON DELETE CASCADE;');
    // con.query('ALTER TABLE `anfrage` ADD FOREIGN KEY (`angebot_id`) REFERENCES `angebot` (`id`) ON DELETE CASCADE;');
    // con.query('ALTER TABLE `download` ADD FOREIGN KEY (`user_id`) REFERENCES `benutzer` (`id`) ON DELETE CASCADE;');
    // con.query('ALTER TABLE `download` ADD FOREIGN KEY (`item_id`) REFERENCES `medium` (`id`) ON DELETE CASCADE;');

    /* Tabellen füllen */
    //Benutzer
    con.query('INSERT INTO benutzer (name, password, email, description, rolle, datum_registration, last_login) VALUES (?, ?, ?, ?, ?, ?, ?);', ['Joe', '$2a$10$QbA58OV2kP.icxJE54Fr5uKM.XSv6gDvERopVraLZZd9mcDlL27Q2', 'Joe@informatik.hs-fulda.de', 'Ich bin Joe und ich mag Züge', 0, fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"), fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss")],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO benutzer (name, password, email, description, rolle, datum_registration, last_login) VALUES (?, ?, ?, ?, ?, ?, ?);', ['Peter', '$2a$10$QbA58OV2kP.icxJE54Fr5uKM.XSv6gDvERopVraLZZd9mcDlL27Q2', 'Peter@informatik.hs-fulda.de', 'Ich bin Peter und ich mag Züge', 0, fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"), fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss")],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO benutzer (name, password, email, description, rolle, datum_registration, last_login) VALUES (?, ?, ?, ?, ?, ?, ?);', ['Hans', '$2a$10$QbA58OV2kP.icxJE54Fr5uKM.XSv6gDvERopVraLZZd9mcDlL27Q2', 'Hans@informatik.hs-fulda.de', 'Ich bin Hans und ich mag Züge', 0, fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"), fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss")],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO benutzer (name, password, email, description, rolle, datum_registration, last_login) VALUES (?, ?, ?, ?, ?, ?, ?);', ['admin', '$2a$10$QbA58OV2kP.icxJE54Fr5uKM.XSv6gDvERopVraLZZd9mcDlL27Q2', 'admin@informatik.hs-fulda.de', 'Ich bin der Admin und ich mag Züge', 1, fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"), fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss")],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })

    // Mehrzeilge benutzer_id hinzugefügt - gleiches Passwort wie admin
    con.query('INSERT INTO benutzer (id, name, password, email, description, rolle, datum_registration, last_login) VALUES (?,?, ?, ?, ?, ?, ?, ?);', [1337, 'admin2', '$2a$10$QbA58OV2kP.icxJE54Fr5uKM.XSv6gDvERopVraLZZd9mcDlL27Q2', 'admin@informatik.hs-fulda.de', 'Hallo', 1, fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"), fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss")],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })


    //Medium 
    con.query('INSERT INTO medium (user_id, dateiname, pfad, thumbnailpfad, dateityp, metadaten, datum_hinzugefuegt) VALUES (?, ?, ?, ?, ?, ?, ?);', [1, 'Auto.jpg', 'image/Auto.jpg', 'thumbnail/Auto.jpg', 'image', '[{"width":800,"height":444,"length":""}]', fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss")],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO medium (user_id, dateiname, pfad, thumbnailpfad, dateityp, metadaten, datum_hinzugefuegt) VALUES (?, ?, ?, ?, ?, ?, ?);', [2, 'Hund.jpg', 'image/Hund.jpg', 'thumbnail/Hund.jpg', 'image', '[{"width":800,"height":444,"length":""}]', fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss")],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO medium (user_id, dateiname, pfad, thumbnailpfad, dateityp, metadaten, datum_hinzugefuegt) VALUES (?, ?, ?, ?, ?, ?, ?);', [3, 'Katze1.jpg', 'image/Katze1.jpg', 'thumbnail/Katze1.jpg', 'image', '[{"width":800,"height":444,"length":""}]', fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss")],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO medium (user_id, dateiname, pfad, thumbnailpfad, dateityp, metadaten, datum_hinzugefuegt) VALUES (?, ?, ?, ?, ?, ?, ?);', [1, 'Katze2.jpg', 'image/Katze2.jpg', 'thumbnail/Katze2.jpg', 'image', '[{"width":800,"height":444,"length":""}]', fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss")],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO medium (user_id, dateiname, pfad, thumbnailpfad, dateityp, metadaten, datum_hinzugefuegt) VALUES (?, ?, ?, ?, ?, ?, ?);', [4, 'Affe.jpg', 'image/Affe.jpg', 'thumbnail/Affe.jpg', 'image', '[{"width":800,"height":444,"length":""}]', fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss")],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO medium (user_id, dateiname, pfad, thumbnailpfad, dateityp, metadaten, datum_hinzugefuegt) VALUES (?, ?, ?, ?, ?, ?, ?);', [4, 'Erdmännchen.jpg', 'image/Erdmännchen.jpg', 'thumbnail/Erdmännchen.jpg', 'image', '[{"width":800,"height":444,"length":""}]', fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss")],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO medium (user_id, dateiname, pfad, thumbnailpfad, dateityp, metadaten, datum_hinzugefuegt) VALUES (?, ?, ?, ?, ?, ?, ?);', [4, 'Kamel.jpg', 'image/Kamel.jpg', 'thumbnail/Kamel.jpg', 'image', '[{"width":800,"height":444,"length":""}]', fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss")],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO medium (user_id, dateiname, pfad, thumbnailpfad, dateityp, metadaten, datum_hinzugefuegt) VALUES (?, ?, ?, ?, ?, ?, ?);', [4, 'Hund.glb', 'glb/Hund.glb', 'thumbnail/Hund.glb', 'glb', '[{"width":0,"height":0,"length":""}]', fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss")],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })

    //Angebot 
    con.query('INSERT INTO angebot (item_id, username, name, description, preis, kategorie, tags, lizenz, freigeschaltet, datum_angebot, reviews, rating, avg_rating, rated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?);', [1, 'Joe', 'Mein cooles Auto', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.', '1337.00', 'Auto', 'Car, cool, Automobil', 'For Sale', 1, fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"), 0, 0, 0, ""],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO angebot (item_id, username, name, description, preis, kategorie, tags, lizenz, freigeschaltet, datum_angebot, reviews, rating, avg_rating, rated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?);', [2, 'Peter', 'Hund', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.', '66.00', 'Hund', 'Dog, pet, wuff', 'For Sale', 1, fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"), 0, 0, 0, ""],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO angebot (item_id, username, name, description, preis, kategorie, tags, lizenz, freigeschaltet, datum_angebot, reviews, rating, avg_rating, rated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?);', [3, 'Hans', 'Irgendeine Katze', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.', '0', 'Katze', 'Cat, meow', 'For Free', 1, fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"), 0, 0, 0, ""],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO angebot (item_id, username, name, description, preis, kategorie, tags, lizenz, freigeschaltet, datum_angebot, reviews, rating, avg_rating, rated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?);', [4, 'Joe', 'Meine Katze', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.', '420.00', 'Katze', 'Cat, cute, baby', 'Hochschule Fulda only', 1, fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"), 1, 3, 3, "4"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO angebot (item_id, username, name, description, preis, kategorie, tags, lizenz, freigeschaltet, datum_angebot, reviews, rating, avg_rating, rated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?);', [5, 'Admin', 'Affe', 'Das ist mein Bruder "Bobo", den ich immer mal fotografiere', '15.00', 'Affe', 'Affe, bobo, banane', 'For Sale', 1, fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"), 0, 0, 0, ""],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO angebot (item_id, username, name, description, preis, kategorie, tags, lizenz, freigeschaltet, datum_angebot, reviews, rating, avg_rating, rated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?);', [6, 'Admin', 'Erdmännchen', 'Ich habe ein Erdmännchen aus dem Frankfurter Zoo geklaut und es abfotografiert.', '0', 'Erdmännchen', 'Erdmännchen, Zoo', 'For Free', 1, fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"), 1, 2, 2, "1"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO angebot (item_id, username, name, description, preis, kategorie, tags, lizenz, freigeschaltet, datum_angebot, reviews, rating, avg_rating, rated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?);', [7, 'Admin', 'Kamel', 'Dieses Kamel stammt aus der Wüste Jordaniens und ist sehr zahm.', '20.00', 'Kamel', 'Camel, cute, Jordanien', 'Hochschule Fulda only', 1, fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"), 2, 8, 3, "1,2"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO angebot (item_id, username, name, description, preis, kategorie, tags, lizenz, freigeschaltet, datum_angebot, reviews, rating, avg_rating, rated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?);', [8, 'Admin', 'Verspielter Hund', 'Ein cooles 3D-Modell mit Animationen', '9.99', '3D-Model', 'glb, dog, hund', 'For Sale', 1, fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"), 1, 5, 5, "4"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    //Service 
    con.query('INSERT INTO service (username, name, description, kategorie, tags, pfad, freigeschaltet, datum_angebot, reviews, rating, avg_rating, rated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?);', ['Joe', 'Mein cooler Service', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.', 'Auto', 'Car, cool, Automobil', "service/audio_placeholder.png", 1, fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"), 0, 0, 0, ""],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO service (username, name, description, kategorie, tags, pfad, freigeschaltet, datum_angebot, reviews, rating, avg_rating, rated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?);', ['Hans', 'Noch ein Service', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.', 'Torte', 'Sueß, Lecker, Essbar', "service/video_placeholder.png", 0, fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"), 0, 0, 0, ""],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })

    //Anfrage 
    con.query('INSERT INTO anfrage (user_id, angebot_id, bestaetigt) VALUES (?, ?, ?);', [1, 1, 1],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO anfrage (user_id, angebot_id, bestaetigt) VALUES (?, ?, ?);', [2, 2, 1],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO anfrage (user_id, angebot_id, bestaetigt) VALUES (?, ?, ?);', [3, 3, 1],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })

    //Download 
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [2, 1, "2022-06-06' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [3, 1, "2022-06-06' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [2, 1, "2022-07-15' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [3, 1, "2022-08-05' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [4, 2, "2022-07-13' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [2, 2, "2022-07-27' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [1, 2, "2022-07-27' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [3, 2, "2022-08-04' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [1, 3, "2022-06-24' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [4, 3, "2022-07-13' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [4, 3, "2022-07-13' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [4, 3, "2022-08-12' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [1, 4, "2022-06-05' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [4, 4, "2022-07-21' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [3, 4, "2022-07-21' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [2, 4, "2022-08-24' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [1, 5, "2022-06-12' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [2, 5, "2022-07-13' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [4, 5, "2022-06-12' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [4, 5, "2022-07-13' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [4, 5, "2022-08-09' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [4, 5, "2022-08-09' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [4, 5, "2022-08-09' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [3, 6, "2022-07-21' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [3, 6, "2022-08-24' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [2, 6, "2022-09-06' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [2, 6, "2022-09-06' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [3, 7, "2022-06-13' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [3, 7, "2022-06-24' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [4, 7, "2022-06-24' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [2, 7, "2022-07-13' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [1, 7, "2022-08-05' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [4, 7, "2022-08-05' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [4, 7, "2022-08-05' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })
    con.query('INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?);', [4, 7, "2022-08-07' '00:00:00"],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        })

    //Nachricht




    con.end(function (err) {
        if (err) throw err;
        else console.log('Done.')
    });
};