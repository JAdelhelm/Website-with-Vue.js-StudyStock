const mysql = require('mysql');
const fs = require('fs');

const serverCa = [fs.readFileSync("DigiCertGlobalRootCA.crt.pem", "utf8")];
var conn=mysql.createConnection({
    host:"teamprojekt-mysql.mysql.database.azure.com",
    user:"teamprojektadmin",
    password:"Sommersemester!",
    database:"teamprojekt",
    port:3306,
    ssl: {
        rejectUnauthorized: true,
        ca: serverCa
    }
});

conn.connect(
    function (err) { 
        if (err) { 
            console.log("!!! Cannot connect !!! Error:");
            throw err;
        }
        else {
            console.log("Connection established.");
            readData();
        }
    });

function readData(){
    conn.query('SELECT * FROM inventory', 
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Selected ' + results.length + ' row(s).');
            for (i = 0; i < results.length; i++) {
                console.log('Row: ' + JSON.stringify(results[i]));
            }
            console.log('Done.');
        })
    conn.end(
        function (err) { 
            if (err) throw err;
            else  console.log('Closing connection.') 
    });
};