const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const acceptChat = require("./socketEvents/acceptChat");
const creatingSocketID = require("./socketEvents/creatingSessionID");
const findDialogueById = require("./socketEvents/findDialogueById");
const setUserNickname = require('./socketEvents/setUserNickname');


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: {
    origin: "*",
    methods: ["GET", "POST"]
} });

let connectedUsersList = new Map();
let activeDialogues = [];

//TODO: Запретить открытие чата с самим собой
//TODO: Добавить события отправки уведомления (отмена, ожидание подтверждения)

io.on("connection", (socket) => {
    console.log('user connected', socket.id);
    socket.emit('userID', creatingSocketID(socket, connectedUsersList));
    console.log('connected users', connectedUsersList);

    const standartParameters = {connectedUsersList, socket, io}
    socket.on('setUsername', data => setUserNickname(data, connectedUsersList, socket.id))

    socket.on('findDialogueById', searchedId => findDialogueById(io, socket, searchedId, connectedUsersList, activeDialogues));

    socket.on('acceptChat', data => acceptChat(data, activeDialogues, standartParameters))

    socket.on('getUsers', () => {
        const convertedMap = [...connectedUsersList].map(([name, value]) => ({ name, value }))
        console.log('req to get users');
        socket.emit('getUsers', convertedMap)
    })

    socket.on('disconnect', data => {
        connectedUsersList.delete(socket.id)    
        console.log('user disconnect:', socket.id);
        // console.log('connected users:', connectedUsersList)
    })
});

io.on('uncaughtException', (exception) => {
    // handle or ignore error
    console.log('uncaughtException', exception);
});

httpServer.listen(8080);