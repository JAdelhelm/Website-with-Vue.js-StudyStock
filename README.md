# Studystock - Exchange platform for students
The website offers the possibility to search and filter for media. Media can be available in various forms, such as images, audio or videos. Uploaded content is displayed on the start page as soon as an offer has been created and the admin has activated it.  Users can also be created and can contact each other via chat.  Furthermore, it is also possible to offer services to other students / users. User data is stored in encrypted form in a MySQL database.


https://github.com/JAdelhelm/Studystock-Website-with-Vue.js-and-Node.js/assets/83546217/a862ae86-c6a7-4cf6-ba4d-78be4da8d4bd

<img src="./picture-website.png">






# Instructions
1. `git clone` the project
2. Navigate to the repository
3. Execute `npm install` (In the root directory)
4. Execute `npm install` in the folder `my-app`

## Database
1. Download MySQL: https://dev.mysql.com/downloads/installer/
   - Windows (x86, 32-bit), MSI Installer (435.7MB)
   - Choose the custom option
   - Install MySQL Server and Workbench - Server 8.x and Workbench 8.x
     - password: password
   - Start Workbench and enter: `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';`

2. Test the connection by navigating to the folder `nodejsmysql`
   - Execute `node db_connection.js` and then cancel
3. Create the database with `node create_db.js`
4. Under MySQL Workbench, the database (localhost) should now be available.
5. To execute queries on the database, execute `USE teamprojekt;` at the beginning of the query.
6. Then create a table with `node create_table.js`
7. View the different tables in MySQL Workbench with SHOW TABLES;.
8. View the respective table with SELECT * FROM tablename;
9. Navigate back to the root directory and execute `npm run dev`.
10. Open a new bash and navigate to my-app and execute `NODE_OPTIONS=--openssl-legacy-provider npm run serve`.

11. Open localhost and register. For example, use the following user:
```json
{
  "username": "test",
  "email": "test@informatik.hs-fulda.de",
  "password": "123456789",
  "password_repeat": "123456789"
}
```
12. Uploaded media can be unlocked by the admin with (create_tables.js - line 106):
```json
{
  "username": "admin",
  "password": "admin12345",
}
```


### Accessing the Database Server
1. Open MySQL Workbench and write a new connection
   1. Connection Name: "any"
   2. Hostname: teamprojekt-mysql.mysql.database.azure.com
   3. User: teamprojektadmin
   4. Password: Sommersemester!
   5. Test Connection
   6. If the connection is established, then click "OK"

#  Anleitung
1.  ``git clone``
    -  Git Bash öffnen und zum Ordner navigieren
2. In das Repositorium navigieren
3. ``npm install`` ausführen (Im Oberverzeichnis)
4. ``npm install`` ausführen im Ordner ``my-app``



## A major contribution from my side was the integration of automated tagging with machine learning
<img src="./machine-learning-example.png">
<img src="./machine-learning-example-2.png">

# Created by:
- Jörg Adelhelm
- Maximilian Leitschuh
- Julian Schuster
- Niklas Kümmel
---
