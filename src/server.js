import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views")
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req,res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"))

const handleListen = () => console.log(`Listening on http://localhost:3001`)

const server = http.createServer(app)
const wss = new WebSocket.Server({server})

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Connected to Browser")
    socket.on("close", () => console.log("Disconnected from the Browser"))
    socket.on("message", (msg) => {        
        const message = JSON.parse(msg);
        console.log(message);

        switch(message.type){
            case "new_message":
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname} : ${message.payload}`));
                break;
            case "nickname":                
                socket["nickname"] = message.payload;                
                break;
        }
        //console.log(message, Buffer.from(message, "base64").toString("utf-8"));                
    });
});

server.listen(3001, handleListen);

//app.listen(3000)
