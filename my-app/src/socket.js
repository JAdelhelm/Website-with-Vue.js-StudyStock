import {
    io
} from "socket.io-client";

var socket = null;

if (window.location.hostname.includes("localhost")) {
    console.log("Socket läuft im Localhost");
    socket = io("http://localhost:8080", {
        autoConnect: true
    })
} else {
    console.log("Socket läuft in der Cloud");
    socket = io("https://teamprojekt.azurewebsites.net", {
        autoConnect: true,
        rejectUnauthorized: false
    })
}

export default socket;