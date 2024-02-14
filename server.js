/**
 * Author: Julian Schuster, Jörg Adelhelm, Maximilian Leitschuh, Niklas Kümmel
 * Node Server initialisierung und API Routen 
 */

const express = require('express')
const app = express(),
  bodyParser = require('body-parser')
port = process.env.PORT || 8080
//ffmpeg installieren für Video Thumbnail-Generierung
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)
const crypto = require('crypto')
const fns = require('date-fns')
const mysql = require('mysql')
const fs = require('fs')
const {
  BlobServiceClient
} = require('@azure/storage-blob')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const fetch = (...args) =>
  import('node-fetch').then(({
    default: fetch
  }) => fetch(...args));

const multer = require('multer')
//Multer für fileupload

const upload = multer({
  dest: process.cwd() + '/my-app/src/assets/files/',
  limits: {
    fileSize: 52428800 // 50 MB
  }
})
const fileSizeLimitErrorHandler = (err, req, res, next) => {
  if (err) {
    return res.status(200).json({
      msg: 'File is too big! The limit is 50 MB.',
    })
  } else {
    next()
  }
}
require('dotenv').config()
const sharp = require('sharp');
const sizeOf = require('image-size');
const {
  getVideoDurationInSeconds
} = require('get-video-duration')
const {
  getAudioDurationInSeconds
} = require('get-audio-duration')
const watermark = require('jimp-watermark');
const userMiddleware = require('./middleware/users.js')

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
app.use(express.static(process.cwd() + '/my-app/dist'))

/**
 * Author: Julian Schuster
 * Aufbau zum MySQL Server mit unterscheidung zwischung Development und Production
 */
var con = null

if (process.env.NODE_ENV == 'dev') {
  console.log('Node Server läuft in Development')
  con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'teamprojekt',
  })
} else {
  console.log('Node Server läuft in Production')
  const serverCa = [
    fs.readFileSync(
      './nodejsmysql/production/DigiCertGlobalRootCA.crt.pem',
      'utf8',
    ),
  ]
  con = mysql.createConnection({
    host: 'teamprojekt-mysql.mysql.database.azure.com',
    user: 'teamprojektadmin',
    password: 'Sommersemester!',
    database: 'teamprojekt',
    port: 3306,
    ssl: {
      rejectUnauthorized: true,
      ca: serverCa,
    },
  })
}

//Mit der MySQL-Datenbank verbinden
con.connect(function (err) {
  if (err) throw err
  console.log(process.env.NODE_ENV + ' DB Connected!')
})

//Node Server starten
const server = app.listen(port, () => {
  console.log(`Server listening on the port::${port}`)
})

/**
 * Author: Julian Schuster
 * Der Regex prüft, ob die URL nicht /api ist, und leitet dann zu index.html weiter -> ist für Production wichtig!
 */
app.get(/^((?!\/api\/).)*$/, function (req, res) {
  res.sendFile(process.cwd() + '/my-app/dist/index.html')
})

//Socket.io initialisierung
const io = require('socket.io')(server, {
  rejectUnauthorized: false,
  cors: {
    origin: '*',
  },
})

// socket.js file laden und an das socket.io Objekt übergeben
var chat = require('./socket.js');
//Socket und DB con an die start funktion von chat übergeben
chat.start(io, con);

/**
 * Author: Julian Schuster
 * Route um alle registrierten Benutzer zu bekommen
 */
app.get('/api/users', userMiddleware.isLoggedIn, function (req, res, next) {
  con.query('SELECT id, name FROM benutzer', function (err, result) {
    if (err) throw err
    return res.send(result)
  })
})

/**
 * Author: Julian Schuster
 * Route für Fileupload in Development und Production
 */
app.post(
  '/api/file/upload',
  userMiddleware.isLoggedIn,
  upload.single('file'),
  fileSizeLimitErrorHandler,
  function (req, res, next) {
    let hashedFileName = null
    let datatype = null
    let dateiname = null
    let dirPath = null
    let metadata = [{
      width: 0,
      height: 0,
      length: 0,
    }]

    //Überprüfen ob ein valides File ankam
    if (typeof req.file == 'undefined') {
      return res.status(200).json({
        msg: 'Server Error!',
      })
    }

    //MimeType der Datei bestimmen
    datatype = getIconForMIMEtype(req.file.mimetype)

    if (datatype == "file") {
      return res.status(200).json({
        msg: 'Only image, audio and video allowed!',
      })
    }

    if (datatype == "glb") {
      saveGLTF(req.file);
      return
    }

    dateiname = req.file.originalname

    //Dateiname aus Sicherheitsgründen hashen
    hashedFileName = +new Date() + crypto.createHash('sha1').update(dateiname).digest('hex')

    //Neuen lokalen Pfad für die hochgeladene Datei bauen
    dirPath =
      __dirname +
      '/my-app/src/assets/files/' +
      datatype +
      '/' +
      hashedFileName +
      '.' +
      dateiname.split('.')[1]

    var oldPath = req.file.path
    var newPath = dirPath

    //Thumbnails werden in einem separaten Ordner gespeichert
    var thumbnailPath =
      './my-app/src/assets/files/thumbnail/' + hashedFileName + '.png'

    //Watermark Einstellungen
    var options = {
      'ratio': 0.6,
      'opacity': 0.6,
      'dstPath': thumbnailPath
    };

    //File in den richtigen Ordner verschieben
    fs.rename(oldPath, newPath, function (err) {
      if (err) throw err

      //1. Wenn in Production, File in Azure Blob Storage Speichern, ansonsten lokal gespeichert lassen
      //2. Metadaten aus Image, Video und Audio holen
      //3. Wenn File ein Video ist, thumbnail generieren
      //4. Wenn File ein Image ist, neues Bild mit Watermark erzeugen
      //5. Uploadprozess fertig
      uploadFile(dirPath, false)
        .then(() => getMetadata())
        .then(() => datatype == 'video' ? makeVideoThumbnail(dirPath, hashedFileName) : console.log("Kein Video"))
        .then(() => datatype == 'image' ? makeImageThumbnail(newPath) : console.log("Kein Image"))
        .then(() => console.log('Files hochgeladen'))
        .catch((ex) => console.log(ex.message))
    })

    function saveGLTF(gltf) {
      dateiname = gltf.originalname

      //Dateiname aus Sicherheitsgründen hashen
      hashedFileName = +new Date() + crypto.createHash('sha1').update(dateiname).digest('hex')

      //Neuen lokalen Pfad für die hochgeladene Datei bauen
      let newPath =
        __dirname +
        '/my-app/public/glb/' +
        hashedFileName +
        '.' +
        dateiname.split('.')[1]

      //File in den richtigen Ordner verschieben
      fs.rename(gltf.path, newPath, function (err) {
        if (err) throw err

        uploadFile(newPath, false)
          .then(() => console.log('Files hochgeladen'))
          .then(() => process.env.NODE_ENV == 'prod' ? fs.unlinkSync(newPath) : console.log("gltf nicht löschen"))
          .then(() => addFileToDB())
      })
    }

    //Funktion zur Thumbnailgenerierung bei einem Video-Upload
    function makeImageThumbnail(file) {
      watermark.addWatermark(file, './my-app/src/assets/studystock.png', options).then(data => {

        if (process.env.NODE_ENV == 'prod') {
          //Kurz warten bis das File lokal wirklich vorhanden ist
          setTimeout(function () {
            uploadFile(data.destinationPath, true)
              .then(() => console.log('Thumbnail hochgeladen'))
              .catch((ex) => console.log(ex.message))
          }, 500);
        }
      }).catch(err => {
        console.log(err);
      });
    }

    //Funktion zur Thumbnailgenerierung bei einem Video-Upload
    function makeVideoThumbnail(file, filename) {
      // Setup event handlers
      ffmpeg(file).on('filenames', function (filenames) {
          console.log('Thumbnailname ist: ' + filenames.join(', '))
        })
        .on('end', function () {
          uploadFile(thumbnailPath, true)
            .then(() => console.log('Thumbnail hochgeladen'))
            .catch((ex) => console.log(ex.message))
        })
        .on('error', function (err) {
          console.log('an error happened: ' + err.message)
        })
        //Screenshot an bestimmten Zeitpunkt aufnehmen
        .takeScreenshots({
            count: 1,
            timemarks: ['00:00:02.000'],
            size: '300x200',
            filename: filename.split('.')[0] + '.png',
          },
          './my-app/src/assets/files/thumbnail/',
        )
    }

    //Wenn in Production -> File in Azure Blob Storage hochladen
    async function uploadFile(path, thumbnail) {
      if (process.env.NODE_ENV == 'prod') {
        const file = fs.readFileSync(path)

        const AZURE_STORAGE_CONNECTION_STRING =
          'DefaultEndpointsProtocol=https;AccountName=teamprojektstorage;AccountKey=YOURKEY'

        if (!AZURE_STORAGE_CONNECTION_STRING) {
          throw Error('Azure Storage Connection string not found')
        }

        //Erstellen eines BlobServiceClient-Objekts, das zum Erstellen eines Containerclients verwendet wird
        const blobServiceClient = BlobServiceClient.fromConnectionString(
          AZURE_STORAGE_CONNECTION_STRING,
        )

        // Container name
        const containerName = 'files'

        // Referenz auf einen Container abrufen
        const containerClient = blobServiceClient.getContainerClient(
          containerName,
        )

        // Eindeutigen Namen für den Blob erstellen
        var blobName = ''

        if (thumbnail) {
          blobName = 'thumbnail/' + hashedFileName + '.png'
        } else {
          blobName =
            datatype + '/' + hashedFileName + '.' + dateiname.split('.')[1]
        }

        // Blockblob-Client holen
        const blockBlobClient = containerClient.getBlockBlobClient(blobName)

        console.log('\nUploading to Azure storage as blob:\n\t', blobName)

        const uploadBlobResponse = await blockBlobClient.upload(
          file,
          file.length,
        )

        console.log(
          'Blob was uploaded successfully. requestId: ',
          uploadBlobResponse.requestId,
        )

        if (thumbnail) {
          try {
            fs.unlinkSync(dirPath)
            console.log('File locally removed')
          } catch (err) {
            console.error(err)
          }
        }
      }
    }

    function getMetadata() {
      //Höhe und Breite, bzw. Länge der hochgeladenen Datei holen
      if (datatype == 'image') {
        var dimensions = sizeOf(dirPath);
        metadata[0].width = dimensions.width;
        metadata[0].height = dimensions.height;
        addFileToDB();
      } else if (datatype == 'video') {
        getVideoDurationInSeconds(dirPath).then((duration) => {
          metadata[0].length = duration;
          addFileToDB();
        })
      } else if (datatype == 'audio') {
        getAudioDurationInSeconds(dirPath).then((duration) => {
          metadata[0].length = duration;
          addFileToDB();
        })
      }
    }

    //Funktion zum Schreiben in die Datenbank
    function addFileToDB() {
      userid = req.body.userid
      angebotname = req.body.name
      kategorie = req.body.kategorie
      tags = req.body.tags
      username = req.body.username

      con.query(
        'INSERT INTO medium (user_id, dateiname, pfad, thumbnailpfad, dateityp, metadaten, datum_hinzugefuegt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          userid,
          dateiname,
          datatype + '/' + hashedFileName + '.' + dateiname.split('.')[1],
          'thumbnail/' + hashedFileName + '.png',
          datatype,
          JSON.stringify(metadata),
          fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"),
        ],
        function (err, result) {
          if (err) throw err
          return res.status(200).send({
            msg: 'The file has been uploaded successfully!',
          })
        },
      )
    }
  },
)

/**
 * Author: Julian Schuster
 * CreateOffer - Route zum erstellen eines Angebots
 */
app.post('/api/offer/create', userMiddleware.isLoggedIn, function (
  req,
  res,
  next,
) {
  console.log(req.body.params)
  con.query(
    'INSERT INTO angebot (username, name, description, item_id, preis, kategorie, tags, lizenz, freigeschaltet, datum_angebot, reviews, rating, avg_rating, rated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)',
    [
      req.body.params.username,
      req.body.params.name,
      req.body.params.description,
      req.body.params.itemid,
      req.body.params.price,
      req.body.params.category,
      req.body.params.tags,
      req.body.params.license,
      0,
      fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"),
      0,
      0,
      0,
      '',
    ],
    function (err, result) {
      if (err) return res.send('Angebot bereits vorhanden')
      console.log('1 record inserted')
      return res.send('Angebot erstellt')
    },
  )
})

/**
 * Author: Niklas Kümmel
 * CreateService - Route zum erstellen eines Services
 */
app.post('/api/service', userMiddleware.isLoggedIn, function (
  req,
  res,
  next,
) {
  console.log(req.body.params);
  con.query(
    'INSERT INTO service (username, name, description, kategorie, tags, pfad, freigeschaltet, datum_angebot, reviews, rating, avg_rating, rated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      req.body.params.username,
      req.body.params.name,
      req.body.params.description,
      req.body.params.category,
      req.body.params.tags,
      req.body.params.path,
      0,
      fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"),
      0,
      0,
      0,
      '',
    ],
    function (err, result) {
      if (err) return res.send('Service bereits vorhanden')
      console.log('1 record inserted')
      return res.status(200).send({
        msg: 'Service created successfully!',
      })
    },
  )
})

/**
 * Author: Julian Schuster
 * SendRequest - Route um eine Anfrage zum Download eines kostenpflichtiges Angebots zu senden
 */
app.post('/api/request', userMiddleware.isLoggedIn, function (req, res, next) {
  con.query(
    'INSERT INTO anfrage (user_id, angebot_id, bestaetigt) VALUES (?, ?, ?)',
    [req.body.userid, req.body.angebotid, 0],
    function (err, result) {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.send('Downloadanfrage wurde bereits gesendet')
        }
      } else {
        console.log('1 record inserted')
        return res.send('Downloadanfrage gesendet')
      }
    },
  )
})

/**
 * Author: Julian Schuster
 * AcceptRequest - Route um eine Anfrage zu akzeptieren
 */
app.put('/api/request', userMiddleware.isLoggedIn, function (req, res, next) {
  con.query(
    'UPDATE anfrage SET bestaetigt = 1 WHERE user_id = ' +
    req.body.params.userid +
    ' AND angebot_id = ' +
    req.body.params.angebotid,
    function (err, result) {
      if (err) throw err
      console.log('1 record updated')
      return res.send('Anfrage bestätigt')
    },
  )
})

/**
 * Author: Julian Schuster
 * DeclineRequest - Route um eine Anfrage abzulehnen
 */
app.delete('/api/request', userMiddleware.isLoggedIn, function (
  req,
  res,
  next,
) {
  con.query(
    'DELETE FROM anfrage WHERE user_id = ' +
    req.query.userid +
    ' AND angebot_id = ' +
    req.query.angebotid,
    function (err, result) {
      if (err) throw err
      console.log('1 record deleted')
      return res.send('Anfrage abgelehnt')
    },
  )
})

/**
 * Author: Julian Schuster
 * CheckRequest - Route zum überprüfen ob ein Benutzer Downloadrechte auf ein kostenpflichtiges Angebot hat
 */
app.get('/api/request', userMiddleware.isLoggedIn, function (req, res, next) {
  con.query(
    'SELECT user_id, angebot_id, bestaetigt FROM anfrage WHERE user_id = ' +
    req.query.userid +
    ' AND angebot_id = ' +
    req.query.offerid,
    function (err, result) {
      if (err) throw err
      return res.send(result)
    },
  )
})

/**
 * Author: Julian Schuster
 * GetRequests - Route zum finden aller Anfragen eines Benutzers
 */
app.get('/api/requests', userMiddleware.isLoggedIn, function (req, res, next) {
  con.query(
    'SELECT user_id, angebot_id, bestaetigt, angebot.name as angebotname, benutzer.name as anfragename FROM anfrage INNER JOIN angebot ON angebot_id = angebot.id INNER JOIN benutzer ON user_id = benutzer.id WHERE username = "' +
    req.query.username +
    '" AND bestaetigt = 0',
    function (err, result) {
      if (err) throw err
      return res.send(result)
    },
  )
})

/**
 * Author: Julian Schuster
 * DeleteMedium - Route zum löschen eines hochgeladenen Mediums
 * Hinweis: Auch Lokal und in Azure löschen!
 */
app.delete('/api/medium', userMiddleware.isLoggedIn, function (req, res, next) {
  con.query('DELETE FROM medium WHERE id = ' + req.query.id, function (
    err,
    result,
  ) {
    if (err) throw err
    console.log('1 record deleted')

    con.query('DELETE FROM angebot WHERE item_id = ' + req.query.id, function (
      err,
      result,
    ) {
      if (err) throw err
      console.log('1 record deleted')
    })

    return res.send('Medium gelöscht')
  })
})

/**
 * Author: Niklas Kuemmel
 * DeleteService - Route zum Löschen eines veröffentlichten Service
 * Hinweis: Auch Lokal und in Azure löschen!
 */
app.delete('/api/service', userMiddleware.isLoggedIn, function (req, res, next) {
  con.query('DELETE FROM service WHERE id = ' + req.query.id, function (
    err,
    result,
  ) {
    if (err) throw err
    console.log('1 service deleted')

    return res.send('Service gelöscht')
  })
})
/**
 * Author: Maximilian Leitschuh
 * DownloadHistory - Alle getätigten Downloads eines Benutzers holen
 */
app.get('/api/downloads', userMiddleware.isLoggedIn, function (req, res, next) {
  con.query(
    'SELECT download.user_id, download.item_id, download.datum, medium.dateiname, medium.pfad, medium.dateiname, medium.thumbnailpfad, medium.dateityp FROM download, medium  WHERE download.user_id = ' +
    req.query.userid +
    ' AND download.item_id = medium.id GROUP BY item_id',
    function (err, result) {
      if (err) throw err
      return res.send(result)
    },
  )
})

/**
 * Author: Maximilian Leitschuh
 * LineChartProfil - Line-Chart, downloads of the user
 */
app.get('/api/downloadchart', userMiddleware.isLoggedIn, function (req, res, next) {
  con.query(
    'SELECT SUBSTRING(datum, 1, 10) AS Datum, COUNT(datum) AS AnzahlDownloads from download WHERE user_id = ' + req.query.userid + ' GROUP BY SUBSTRING(datum, 1, 10) ORDER BY datum',
    function (err, result) {
      if (err) throw err
      return res.send(result)
    },
  )
})

/**
 * Author: Maximilian Leitschuh
 * LineChartOffer - Line-Chart, downloads of the offer
 */
app.get('/api/downloadMedium', userMiddleware.isLoggedIn, function (req, res, next) {
  con.query(
    'SELECT SUBSTRING(datum, 1, 10) AS Datum, COUNT(datum) AS AnzahlDownloads from download WHERE item_id = ' + req.query.itemid + ' GROUP BY SUBSTRING(datum, 1, 10) ORDER BY datum',
    function (err, result) {
      if (err) throw err
      return res.send(result)
    },
  )
})

/**
 * Author: Maximilian Leitschuh
 * BarChartBenutzer/BarChartProfil - Bar-Charts, downloads of each offer of the user
 */
app.get('/api/downloadOffers', userMiddleware.isLoggedIn, function (req, res, next) {
  con.query(
    'SELECT COUNT(datum) AS AnzahlDownloads, angebot.name as Medium from download INNER JOIN angebot ON download.item_id = angebot.item_id INNER JOIN medium ON angebot.item_id = medium.id WHERE medium.user_id = ' +
    req.query.userid + ' GROUP BY angebot.item_id ORDER BY COUNT(datum) DESC',
    function (err, result) {
      if (err) throw err
      return res.send(result)
    },
  )
})

//OffersHistory - Alle erstellen Angebote eines Benutzers holen
app.get('/api/offers', userMiddleware.isLoggedIn, function (req, res, next) {
  con.query(
    'SELECT angebot.id, angebot.username, angebot.name, angebot.item_id, angebot.preis, angebot.kategorie, angebot.tags, angebot.lizenz, angebot.freigeschaltet, angebot.datum_angebot, medium.id as mediumid, medium.user_id, medium.dateiname, medium.pfad, medium.thumbnailpfad, medium.dateityp, medium.metadaten, medium.datum_hinzugefuegt FROM angebot INNER JOIN medium ON angebot.item_id = medium.id WHERE medium.user_id = ' +
    req.query.userid + ' AND angebot.freigeschaltet = 1',
    function (err, result) {
      if (err) throw err
      return res.send(result)
    },
  )
})

//Admin - AcceptOffer - Angebot bestätigen
app.put('/api/offer/accept', userMiddleware.isLoggedIn, function (
  req,
  res,
  next,
) {
  con.query(
    'UPDATE angebot SET freigeschaltet = 1 WHERE id = ' +
    req.body.params.angebotid,
    function (err, result) {
      if (err) throw err
      console.log('1 record updated')
      return res.send('Angebot freigeschaltet')
    },
  )
})

//Admin - DeclineOffer - Angebot ablehnen
app.delete('/api/offer/decline', userMiddleware.isLoggedIn, function (
  req,
  res,
  next,
) {
  con.query('DELETE FROM angebot WHERE id = ' + req.query.angebotid, function (
    err,
    result,
  ) {
    if (err) throw err
    console.log('1 record deleted')
    return res.send('Angebot abgelehnt')
  })
})

/**
 * Author: Julian Schuster
 * DeleteMyOffer - Route zum löschen eines eigenen Offers
 */
app.delete('/api/offer', userMiddleware.isLoggedIn, function (req, res, next) {
  con.query('DELETE FROM angebot WHERE id = ' + req.query.angebotid, function (
    err,
    result,
  ) {
    if (err) throw err
    console.log('1 record deleted')
    return res.send('Angebot gelöscht')
  })
})

/**
 * Author: Niklas Kümmel
 * ServicesHistory - Alle erstellten Services eines Benutzers holen
 */
app.get('/api/services', userMiddleware.isLoggedIn, function (req, res, next) {
  con.query(
    'SELECT service.id, service.username, service.name, service.kategorie, service.tags, service.pfad, service.freigeschaltet, service.datum_angebot FROM service WHERE service.username = "' +
    req.query.username + '"',
    function (err, result) {
      if (err) throw err
      return res.send(result)
    },
  )
})

/**
 * Author: Niklas Kümmel
 * ServicesHistory - Alle erstellten Services eines Benutzers holen
 */
app.get('/api/searchservices', userMiddleware.isLoggedIn, function (req, res, next) {
  let type = req.query.type;
  let query = req.query.query;
  let sortBy = req.query.sortBy;

  var dbQuery = "SELECT service.id, service.username, service.name, service.kategorie, service.tags, service.pfad, service.freigeschaltet, service.datum_angebot FROM service WHERE service.name LIKE'%" +
    query +
    "%' OR service.kategorie LIKE'%" +
    query +
    "%' OR service.tags LIKE'%" +
    query +
    "%' "

  if (type == 'All') {
    dbQuery += ''
  } else if (type == 'Audio') {
    dbQuery = 'SELECT * from service WHERE service.pfad = "bruh"'
  } else if (type == 'Video') {
    dbQuery = 'SELECT * from service WHERE service.pfad = "bruh"'
  } else if (type == 'Image') {
    dbQuery = 'SELECT * from service WHERE service.pfad = "bruh"'
  } else if (type == 'Service') {
    dbQuery += ''
  } else if (type == 'GLB') {
    dbQuery = 'SELECT * from service WHERE service.pfad = "bruh"'
  }

  if (sortBy == 'Latest') {
    dbQuery += 'ORDER BY service.datum_angebot DESC'
  } else if (sortBy == 'Oldest') {
    dbQuery += 'ORDER BY service.datum_angebot ASC'
  }

  con.query(
    dbQuery,
    function (err, result) {
      if (err) throw err
      return res.send(result)
    },
  )
})

/**
 * Author: Niklas Kümmel
 * Service - Einzelner Service holen
 */
app.get('/api/service', userMiddleware.isLoggedIn, (req, res) => {
  con.query(
    "SELECT service.id, benutzer.id AS user_id, service.username, service.name, service.description, service.kategorie, service.tags, service.pfad, service.freigeschaltet, service.datum_angebot FROM service INNER JOIN benutzer ON service.username = benutzer.name WHERE service.id = '" +
    req.query.id +
    "' ",
    function (err, result) {
      if (err) throw err
      return res.send(result)
    },
  )
})

/**
 * Author: Niklas Kümmel
 * Service - Einzelner Service updaten
 */
app.put('/api/service/update', userMiddleware.isLoggedIn, (req, res) => {
  con.query(
    "UPDATE service SET service.name = ?, service.description = ?, service.kategorie = ?, service.tags = ?, service.pfad = ? WHERE service.id = ?",
    [
      req.body.params.name,
      req.body.params.description,
      req.body.params.kategorie,
      req.body.params.tags,
      req.body.params.pfad,
      req.body.params.id,
    ],
    function (err, result) {
      if (err) throw err
      return res.send(result)
    },
  )
})

/**
 * Author: Jörg Adelhelm
 * Alle Angebote eines Benutzers sperren, wenn ein Benutzer
 * das Profil löscht
 */
app.delete('/api/profil/lock', userMiddleware.isLoggedIn, (req, res) => {
  con.query('DELETE FROM angebot WHERE username = ?', [req.query.username], function (
    err,
    result,
  ) {
    if (err) throw err
    return res.send('Profilinhalte gelöscht')
  })
})

/**
 * Author: Jörg Adelhelm
 * Erstelltes Angebot löschen, aber immer noch
 * für gekaufte und heruntergeladene Inhalte verfügbar lassen.
 */
app.put('/api/offer/lock', userMiddleware.isLoggedIn, function (req, res, next) {
  con.query('UPDATE angebot SET freigeschaltet = 0 WHERE id = ' + req.body.params.angebotid, function (
    err,
    result,
  ) {
    if (err) throw err
    console.log('1 record deleted')
    return res.send('Angebot abgelehnt')
  })
})

/**
 * Author: Jörg Adelhelm
 * Holt alle Tags der veröffentlichten Medien
 */
app.get('/api/summary/tags', userMiddleware.isLoggedIn, function (req, res, next) {
  con.query(
    'SELECT GROUP_CONCAT(tags) as "tags" FROM angebot ; ',
    function (err, result) {
      if (err) throw err
      return res.send(result)
    },
  )
})

/**
 * Author: Julian Schuster
 * Search - Angebote nach bestimmten Suchkriterien finden
 */
app.get('/api/angebote', userMiddleware.isLoggedIn, (req, res) => {
  let sortBy = req.query.sortBy
  let price = req.query.price
  let type = req.query.type

  var dbQuery =
    "SELECT angebot.id, angebot.avg_rating, angebot.reviews, angebot.username, dateiname, medium.id as mediumid, pfad, thumbnailpfad, name, preis, lizenz, kategorie, dateityp, datum_angebot, metadaten, tags, user_id, angebot.description FROM angebot INNER JOIN medium ON angebot.item_id = medium.id WHERE angebot.freigeschaltet = 1 AND angebot.name LIKE'%" +
    req.query.query +
    "%' OR angebot.freigeschaltet = 1 AND angebot.kategorie LIKE'%" +
    req.query.query +
    "%' OR angebot.freigeschaltet = 1 AND angebot.tags LIKE'%" +
    req.query.query +
    "%' "

  if (price == 'All') {
    dbQuery += 'HAVING preis >= 0 '
  } else if (price == 'Free') {
    dbQuery += 'HAVING preis = 0 '
  } else if (price == 'Under 10 Euro') {
    dbQuery += 'HAVING preis between 0 AND 10 '
  } else if (price == 'Under 50 Euro') {
    dbQuery += 'HAVING preis between 0 AND 50 '
  } else if (price == 'Under 100 Euro') {
    dbQuery += 'HAVING preis between 0 AND 100 '
  }

  if (type == 'All') {
    dbQuery += ''
  } else if (type == 'Audio') {
    dbQuery += 'AND dateityp = "audio" '
  } else if (type == 'Video') {
    dbQuery += 'AND dateityp = "video" '
  } else if (type == 'Image') {
    dbQuery += 'AND dateityp = "image" '
  } else if (type == 'Service') {
    dbQuery += 'AND dateityp = "service" '
  } else if (type == 'GLB') {
    dbQuery += 'AND dateityp = "glb" '
  }

  if (sortBy == 'Latest') {
    dbQuery += 'ORDER BY datum_angebot DESC'
  } else if (sortBy == 'Oldest') {
    dbQuery += 'ORDER BY datum_angebot ASC'
  } else if (sortBy == 'Best rated') {
    dbQuery += 'ORDER BY avg_rating DESC'
  } else if (sortBy == 'Lowest price') {
    dbQuery += 'ORDER BY preis ASC'
  } else if (sortBy == 'Highest price') {
    dbQuery += 'ORDER BY preis DESC'
  }

  con.query(dbQuery, function (err, result) {
    if (err) throw err
    return res.send(result)
  })
})

// Offers - Alle noch nicht bestätigten Angebote für Admin holen
app.get('/api/pendingoffers', userMiddleware.isLoggedIn, (req, res) => {
  con.query(
    'SELECT angebot.id, angebot.username, angebot.name, angebot.item_id, angebot.preis, angebot.kategorie, angebot.tags, angebot.lizenz, angebot.freigeschaltet, angebot.datum_angebot, medium.id as mediumid, medium.user_id, medium.dateiname, medium.pfad, medium.thumbnailpfad, medium.dateityp, medium.metadaten, medium.datum_hinzugefuegt FROM angebot INNER JOIN medium ON angebot.item_id = medium.id WHERE angebot.freigeschaltet = 0',
    function (err, result) {
      if (err) throw err
      return res.send(result)
    },
  )
})

//Offer - Einzelnes Angebot holen
app.get('/api/angebot', userMiddleware.isLoggedIn, (req, res) => {
  con.query(
    "SELECT angebot.id, medium.user_id, username, dateiname, datum_angebot, metadaten, tags, name, description, pfad, thumbnailpfad, preis, lizenz, kategorie, dateityp FROM angebot INNER JOIN medium ON angebot.item_id = medium.id WHERE angebot.id ='" +
    req.query.id +
    "' ",
    function (err, result) {
      if (err) throw err
      return res.send(result)
    },
  )
})

//Inventory - Alle hochgeladenen Medien eins Benutzers holen
app.get('/api/inventory', userMiddleware.isLoggedIn, (req, res) => {
  con.query(
    'SELECT * FROM medium WHERE user_id =' + req.query.userid,
    function (err, result) {
      if (err) throw err
      return res.send(result)
    },
  )
})

/**
 * Author: Julian Schuster
 * Download - Route zum downloaden eines Files in Production und Development
 */
app.get('/api/download', userMiddleware.isLoggedIn, (req, res) => {
  con.query(
    "SELECT medium.pfad, dateityp FROM angebot INNER JOIN medium ON angebot.item_id = medium.id WHERE angebot.id = '" +
    req.query.itemid +
    "' ",
    function (err, result) {
      if (err) throw err

      res.set({
        'Content-Disposition': 'attachment; filename="' + result[0].pfad.split('/')[1] + '"',
      });

      //Qualitätseinstellungen und Stream an Frontend senden
      //resizing nur bei dateityp == image
      if (process.env.NODE_ENV === 'dev') {
        let filePath = process.cwd() + '/my-app/src/assets/files/' + result[0].pfad;
        let gltfPath = process.cwd() + '/my-app/public/' + result[0].pfad;

        if (req.query.quality == "High") {
          if (result[0].dateityp == "glb") {
            res.download(gltfPath);
          } else {
            res.download(filePath);
          }
        } else if (req.query.quality == "Medium" && result[0].dateityp == 'image') {
          let dimensions = sizeOf(filePath);
          sharp(filePath)
            .resize(Math.trunc(dimensions.width / 2))
            .toBuffer()
            .then(data => res.type(result[0].pfad.split('.')[1]).send(data))
        } else if (req.query.quality == "Low" && result[0].dateityp == 'image') {
          let dimensions = sizeOf(filePath);
          sharp(filePath)
            .resize(Math.trunc(dimensions.width / 4))
            .toBuffer()
            .then(data => res.type(result[0].pfad.split('.')[1]).send(data))
        }
      }

      if (process.env.NODE_ENV === 'prod') {
        async function getBlob() {

          const AZURE_STORAGE_CONNECTION_STRING =
            'DefaultEndpointsProtocol=https;AccountName=teamprojektstorage;AccountKey=YOURKEY'

          if (!AZURE_STORAGE_CONNECTION_STRING) {
            throw Error('Azure Storage Connection string not found')
          }

          //Erstellen eines BlobServiceClient-Objekts, das zum Erstellen eines Containerclients verwendet wird
          const blobServiceClient = BlobServiceClient.fromConnectionString(
            AZURE_STORAGE_CONNECTION_STRING,
          )

          // Container name
          const containerName = 'files'

          // Referenz auf einen Container abrufen
          const containerClient = blobServiceClient.getContainerClient(
            containerName,
          )

          const blobClient = await containerClient.getBlobClient(result[0].pfad);
          const downloadResponse = await blobClient.download();
          const downloaded = await streamToBuffer(downloadResponse.readableStreamBody);

          //Qualitätseinstellungen und Stream an Frontend senden
          if (req.query.quality == "High") {
            res.type(result[0].pfad.split('.')[1]).send(downloaded);
          } else if (req.query.quality == "Medium" && result[0].dateityp == 'image') {
            let dimensions = sizeOf(downloaded);
            sharp(downloaded)
              .resize(Math.trunc(dimensions.width / 2))
              .toBuffer()
              .then(data => res.type(result[0].pfad.split('.')[1]).send(data))
          } else if (req.query.quality == "Low" && result[0].dateityp == 'image') {
            let dimensions = sizeOf(downloaded);
            sharp(downloaded)
              .resize(Math.trunc(dimensions.width / 4))
              .toBuffer()
              .then(data => res.type(result[0].pfad.split('.')[1]).send(data))
          }
        }

        async function streamToBuffer(readableStream) {
          return new Promise((resolve, reject) => {
            const chunks = [];
            readableStream.on('data', (data) => {
              chunks.push(data instanceof Buffer ? data : Buffer.from(data));
            });
            readableStream.on('end', () => {
              resolve(Buffer.concat(chunks));
            });
            readableStream.on('error', reject);
          });
        }

        getBlob()
          .then(() => console.log('Done'))
          .catch((ex) => console.log(ex.message));
      }
    },
  )
})

/**
 * Author: Julian Schuster
 * Route zum Speichern eines Downloads in der Datenbank -> wichtig für DownloadHistory
 */
app.post('/api/file/download', userMiddleware.isLoggedIn, (req, res) => {
  con.query(
    'INSERT INTO download (user_id, item_id, datum) VALUES (?, ?, ?)',
    [
      req.body.params.userid,
      req.body.params.itemid,
      fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"),
    ],
    function (err, result) {
      if (err) throw err
      res.send('Download erfolgreich')
    },
  )
})

/**
 * Author: Julian Schuster
 * TransmitMessage - Route zum Speichern einer Nachricht in die Datenbank
 */
app.post('/api/message', userMiddleware.isLoggedIn, (req, res) => {
  con.query(
    'INSERT INTO nachricht (sender_id, receiver_id, inhalt, gelesen, datum_geschrieben) VALUES (?, ?, ?, ?, ?)',
    [
      req.body.senderid,
      req.body.receiverid,
      req.body.inhalt,
      false,
      fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"),
    ],
    function (err, result) {
      if (err) throw err
      res.send('Nachricht gesendet')
    },
  )
})

/**
 * Author: Julian Schuster
 * ReceiveMessage - Route zum holen einer Nachricht aus der Datenbank
 */
app.get('/api/message', userMiddleware.isLoggedIn, (req, res) => {
  con.query(
    'SELECT sender_id, inhalt, datum_geschrieben, gelesen FROM nachricht WHERE receiver_id = ' +
    req.query.receiverid + ' AND sender_id = ' + req.query.senderid + ' OR receiver_ID = ' + req.query.senderid + ' AND sender_id = ' + req.query.receiverid,
    function (err, result) {
      if (err) throw err
      res.send(result)
    },
  )
})

app.get('/api/unreadmessages', userMiddleware.isLoggedIn, (req, res) => {
  con.query(
    'SELECT COUNT(gelesen) AS ungelesen FROM nachricht WHERE receiver_id = ? AND gelesen = 0', [req.query.userid],
    function (err, result) {
      if (err) throw err
      res.send(result)
    },
  )
})

/**
 * Author: Julian Schuster
 * messageRead - Route zum updaten der 'gelesen' Spalte
 */
app.put('/api/message', userMiddleware.isLoggedIn, (req, res) => {
  con.query(
    'UPDATE nachricht SET gelesen = 1 WHERE receiver_id = ' +
    req.body.params.receiverid + ' AND sender_id = ' + req.body.params.senderid,
    function (err, result) {
      if (err) throw err
      console.log('1 record updated - Nachrichten auf gelesen gesetzt')
    },
  )
})

//Register
app.post('/api/register', userMiddleware.validateRegister, (req, res, next) => {
  con.query(
    `SELECT * FROM benutzer WHERE LOWER(name) = LOWER(${con.escape(
      req.body.username,
    )});`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          msg: 'This username is already in use!',
        })
      } else {
        // username is available
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              msg: err,
            })
          } else {
            // has hashed pw => add to database
            con.query(
              'INSERT INTO benutzer (name, password, email, rolle, datum_registration, last_login) VALUES (?, ?, ?, ?, ?, ?);',
              [
                req.body.username,
                hash,
                req.body.email,
                0,
                fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"),
                fns.format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"),
              ],
              (err, result) => {
                if (err) {
                  throw err
                  return res.status(400).send({
                    msg: err,
                  })
                }
                return res.status(201).send({
                  msg: 'Registered!',
                })
              },
            )
          }
        })
      }
    },
  )
})

//Login
app.post('/api/login', (req, res, next) => {
  con.query(
    `SELECT * FROM benutzer WHERE name = ${con.escape(req.body.username)};`,
    (err, result) => {
      // user does not exists
      if (err) {
        throw err
        return res.status(400).send({
          msg: err,
        })
      }
      if (!result.length) {
        return res.status(401).send({
          msg: 'Username or password is incorrect!',
        })
      }
      // check password
      bcrypt.compare(
        req.body.password,
        result[0]['password'],
        (bErr, bResult) => {
          // wrong password
          if (bErr) {
            throw bErr
            return res.status(401).send({
              msg: 'Username or password is incorrect!',
            })
          }
          if (bResult) {
            const token = jwt.sign({
                username: result[0].username,
                userId: result[0].id,
              },
              'SECRETKEY', {
                expiresIn: '1d',
              },
            )
            con.query(
              `UPDATE benutzer SET last_login = now() WHERE id = '${result[0].id}'`,
            )
            return res.status(200).send({
              msg: 'Logged in!',
              token,
              user: result[0],
            })
          }
          return res.status(401).send({
            msg: 'Username or password is incorrect!',
          })
        },
      )
    },
  )
})

/**
 * Author: Jörg Adelhelm
 * Aktuelles Profil anzeigen
 */
app.get('/api/profil', userMiddleware.isLoggedIn, (req, res) => {
  con.query('SELECT * FROM benutzer WHERE id = ' + req.query.userid, function (
    err,
    result,
  ) {
    if (err) throw err
    return res.send(result)
  })
})

/**
 * Author: Maximilian Leitschuh
 * Profil in Angebot anzeigen
 */
app.get('/api/user', userMiddleware.isLoggedIn, (req, res) => {
  con.query('SELECT * FROM benutzer WHERE id = ' + req.query.userid, function (
    err,
    result,
  ) {
    if (err) throw err
    return res.send(result)
  })
})

/**
 * Author: Jörg Adelhelm
 * Profileinstellungen -
 * Überprüfen des alten und des neuen Passworts via hashing und
 * anschließendem Update
 */
app.put('/api/profil/update', userMiddleware.isLoggedIn, (req, res) => {
  con.query('SELECT * FROM benutzer WHERE id = ' + req.body.id, function (
    err,
    result,
  ) {
    if (err) throw err

    let pw_check = result[0].password
    // Passwort vom frontend old
    let pw_frontend_check_2 = req.body.old_password
    let pw_frontend_new_password = req.body.new_password_1
    let pw_frontend_new_password2 = req.body.new_password_2
    // console.log(pw_frontend_new_password)
    // console.log(pw_frontend_new_password2)

    bcrypt.compare(pw_frontend_check_2, pw_check, function (err, result) {
      if (result) {
        // Fehlermessage bei Backend-Fehler
        bcrypt.hash(pw_frontend_new_password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              msg: err,
            })
          }
          // Prüft ob das Passwort mindestens 6 Zeichen enthält,
          // falls nicht, wird es nicht in die Datenbank geschrieben und
          // eine Fehlermeldung an das Frontend gesendet
          else if (pw_frontend_new_password.toString().length < 6) {
            return res.status(201).send({
              msg: 'Password must be at least 6 characters long.',
            })
          } else if (pw_frontend_new_password != pw_frontend_new_password2) {
            return res.status(201).send({
              msg: 'Passwords do not match.',
            })
          }

          // Updaten des Passworts in der SQL-Datenbank
          else {
            // has hashed pw => add to database
            con.query(
              'UPDATE benutzer SET password = ? WHERE id = ' + req.body.id,
              [hash],
              (err, result) => {
                if (err) {
                  throw err
                  return res.status(400).send({
                    msg: err,
                  })
                }
                return res.status(201).send({
                  msg: 'Updated!',
                })
              },
            )
          }
        })
      } else {
        return res.status(201).send({
          msg: 'Please insert a valid password.',
        })
      }
    })
  })
})

/**
 * Author: Jörg Adelhelm
 * Aktuelles Profil löschen
 */
app.delete('/api/profil/delete', userMiddleware.isLoggedIn, (req, res) => {
  con.query('DELETE FROM benutzer WHERE id = ' + req.query.id, function (
    err,
    result,
  ) {
    if (err) throw err
    return res.send('Profil gelöscht')
  })
})

/**
 * Author: Jörg Adelhelm
 * Rating-System -
 * Erstellt eine fortlaufende textbasierte Liste,
 * um im Frontend zu überprüfen ob der Benutzer schon bewertet hat.
 */
app.put('/api/offer/rating', userMiddleware.isLoggedIn, function (
  req,
  res,
  next,
) {
  con.query(
    'UPDATE angebot SET rating = rating +  ' +
    req.body.selectedRating +
    ' WHERE id = ' +
    req.body.angebot_id,
    function (err, rows) {
      if (err) throw err
      con.query(
        'UPDATE angebot SET reviews = reviews + 1' +
        ' WHERE id = ' +
        req.body.angebot_id,
        function (err, result) {
          if (err) throw err
          con.query(
            'UPDATE angebot SET avg_rating = rating / reviews, rated = CONCAT(rated, ?) WHERE id = ' +
            req.body.angebot_id,
            [req.body.user_id + ','],
            function (err, result) {},
          )
        },
      )
    },
  )
})

/**
 * Author: Jörg Adelhelm
 * Rating - System avg_rating
 * Sendet die Informationen über das aktuelle avg_rating des Mediums
 * an das Frontend
 */
app.get('/api/offer/rating', userMiddleware.isLoggedIn, (req, res) => {
  con.query(
    'SELECT id, rated, avg_rating, reviews FROM angebot WHERE id = ' +
    req.query.angebot_id,
    function (err, result) {
      if (err) throw err
      return res.send(result)
    },
  )
})

/**
 * Author: Jörg Adelhelm
 * Informationen über Benutzer zum sperren
 */
app.get('/api/admin/users', userMiddleware.isLoggedIn, (req, res) => {
  con.query(
    'SELECT * FROM benutzer',
    function (err, result) {
      if (err) throw err
      return res.send(result)
    },
  )
})

/**
 * Author: Jörg Adelhelm
 * Benutzer-Rolle auf 3 schalten, um ihn zu sperren. 
 * Ebenfalls session token löschen.
 */
app.put('/api/user/lock', userMiddleware.isLoggedIn, (req, res) => {
  con.query(
    'UPDATE benutzer SET rolle = 3 WHERE name = ?', [req.body.params.username],
  )
})

/**
 * Author: Jörg Adelhelm
 * Benutzer-Rolle auf 1 schalten, um ihn zu entsperren. 
 */
app.put('/api/user/unlock', userMiddleware.isLoggedIn, (req, res) => {
  con.query(
    'UPDATE benutzer SET rolle = 1 WHERE name = ?', [req.body.params.username],
  )
})

app.put('/api/user/description', userMiddleware.isLoggedIn, (req, res) => {
  con.query(
    'UPDATE benutzer SET description = ? WHERE id = ?', [req.body.params.description, req.body.params.id],
  )
})

/**
 * Author: Jörg Adelhelm
 * Medium für Tagging
 */
app.get('/api/medium', userMiddleware.isLoggedIn, (req, res) => {
  con.query(
    'SELECT id, pfad, thumbnailpfad, dateityp FROM medium WHERE id = ' +
    req.query.medium_id,
    function (err, result) {
      if (err) throw err
      return res.send(result)
    },
  )
})
/**
 * Author: Jörg Adelhelm
 * Name, Preise und Tags vom Backend holen und dann 
 * im Frontend in Javascript verarbeiten.
 */
app.get('/api/prices/tags', userMiddleware.isLoggedIn, (req, res) => {
  con.query(
    'SELECT name, preis, tags FROM angebot',
    function (err, result) {
      if (err) throw err
      return res.send(result)
    },
  )
})


/**
 * Author: Jörg Adelhelm
 * Laden des lokalen Tensorflow.js Model
 */
// console.log(req.query)
const tf = require('@tensorflow/tfjs')
const tfn = require('@tensorflow/tfjs-node')
// Vorverarbeiten des Tensors
function preprocess(imageTensor) {
  const widthToHeight = imageTensor.shape[1] / imageTensor.shape[0];
  let squareCrop;
  if (widthToHeight > 1) {
    const heightToWidth = imageTensor.shape[0] / imageTensor.shape[1];
    const cropTop = (1 - heightToWidth) / 2;
    const cropBottom = 1 - cropTop;
    squareCrop = [
      [cropTop, 0, cropBottom, 1]
    ];
  } else {
    const cropLeft = (1 - widthToHeight) / 2;
    const cropRight = 1 - cropLeft;
    squareCrop = [
      [0, cropLeft, 1, cropRight]
    ];
  }
  // Expand image input dimensions to add a batch dimension of size 1.
  const crop = tf.image.cropAndResize(
    tf.expandDims(imageTensor), squareCrop, [0], [224, 224]);
  return crop.div(255);
}
const util = require('util');
app.post('/api/tensorflow', userMiddleware.isLoggedIn, (req, res) => {

  loadModel();

  async function loadModel() {

    const handler = tfn.io.fileSystem("./my-app/src/components/models/model.json");
    const model = await tfn.loadGraphModel(handler);
    // console.log(model);
    // 
    // DEV
    if (process.env.NODE_ENV == "dev") {
      const path = "./my-app/src/assets/files/" + req.body.imagesrc;
      console.log(path)
      const readImg = util.promisify(fs.readFile);

      const img = await readImg(path);
      const adaptedImg = tfn.node.decodeImage(img, 3);

      const logits = model.predict(preprocess(adaptedImg));

      const classIndex = await tf.argMax(tf.squeeze(logits)).data();
      const className = model.metadata['classNames'][classIndex[0]];

      // console.log(className)

      return res.send(className)
      // 
      // PROD
    } else if (process.env.NODE_ENV == "prod") {
      // const path2 = "https://teamprojektstorage.blob.core.windows.net/files/" + req.body.imagesrc;
      const path2 = "https://teamprojektstorage.blob.core.windows.net/files/" + req.body.imagesrc;
      // const readImg = util.promisify(path2);

      // const img = await readImg(path2);
      // const img = await fetch(path2)
      let request = require('request').defaults({
        encoding: null
      });


      request.get(path2, function (error, response, body) {
        if (!error && response.statusCode == 200) {

          modelPrediction()
          async function modelPrediction() {
            dataType = req.body.imagesrc.split(".")[1]
            // console.log(dataType)

            data = "data:" + "image/" + dataType + ";base64," + Buffer.from(body).toString('base64');

            const img2 = data.replace(
              /^data:image\/(png|jpeg|jpg);base64,/,
              ""
            );
            const img = Buffer.from(img2, 'base64')

            //  console.log(img)

            // console.log(typeof(img))

            const adaptedImg = tfn.node.decodeImage(img, 3);

            const logits = model.predict(preprocess(adaptedImg));

            const classIndex = await tf.argMax(tf.squeeze(logits)).data();
            const className = model.metadata['classNames'][classIndex[0]];

            // console.log(className)

            return res.send(className)
          }

        }
      });


    }
  }
})






/**
 * Author: Julian Schuster
 * Hilfsfunktion zum zuordnen von Mimetypes zu audio/video/image
 */
function getIconForMIMEtype(mimetype) {
  var audio_types = [
    'audio/aac',
    'audio/opus',
    'audio/ogg',
    'audio/mpeg',
    'audio/wav',
    'audio/webm',
  ]
  var video_types = ['video/mpeg', 'video/mp4', 'video/ogg', 'video/webm']
  var image_types = [
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/bmp',
    'image/svg+xml',
  ]

  var gltf_types = ['application/octet-stream']

  if (audio_types.includes(mimetype)) {
    return 'audio'
  } else if (video_types.includes(mimetype)) {
    return 'video'
  } else if (image_types.includes(mimetype)) {
    return 'image'
  } else if (gltf_types.includes(mimetype)) {
    return 'glb'
  } else {
    return 'file'
  }
}