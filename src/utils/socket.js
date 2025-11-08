const socket = require("socket.io");
const crytpo = require("crypto");
const Chat = require("../models/chat");
const getSecretRoomId = (userId, targetuserId) => {
    return crytpo.createHash("sha256").update([userId, targetuserId].sort().join("_")).digest("hex");
}

const initializeSocket = (server) => {

    const io = socket(server, {
        cors: { origin: process.env.ORIGIN_URL }
    })

    io.on("connection", (socket) => {
        //handle events
        //the event emmited from FE will be recived here
        socket.on("joinChat", ({ userId, targetuserId }) => {
            const roomId = getSecretRoomId(userId, targetuserId);
            console.log(" joined " + roomId);
            socket.join(roomId)
        });
        socket.on("sendMessage", async ({ firstName, lastName, userId, targetuserId, text }) => {
            const roomId = getSecretRoomId(userId, targetuserId);
            // const roomId = [userId, targetuserId].sort().join("_")
            //io.to => Send this message to everyone connected to that specific room. .emit =>Emit an event called 'messageReceived' to those people.
            try {
                let chat = await Chat.findOne({ participants: { $all: [userId, targetuserId] } });
                if (!chat) {
                    chat = new Chat({ participants: [userId, targetuserId], messages: [] });
                }
                chat.messages.push({ senderId: userId, text });
                await chat.save()
                io.to(roomId).emit("messageReceived", { firstName, lastName, text })

            } catch (err) {
                console.log(err)
            }

            console.log(firstName + " " + text)
        });
        socket.on("disconnect", () => { });
    })
}

module.exports = initializeSocket;