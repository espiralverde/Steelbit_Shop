
const { createServer } = require("http")
const { Server } = require("socket.io")
const express = require ("express")
const fileUpload = require ("express-fileupload") // paquete que me permite subir y manejar archivos en express (backend)
const cookieParser = require ("cookie-parser")
const app = express()

const httpServer = createServer(app)
global.io = new Server(httpServer)

app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())

const admins = []
let activeChats = []
function get_random(array) {
    return array[Math.floor(Math.random() * array.length)]
}

//con esto conecto el front con el back para los mensajes de chat, usando socket.io
io.on ("connection", (socket) => {
    socket.on("admin conectado con el server", (adminName) => {
        admins.push({id: socket.id, admin: adminName})
    })
    socket.on("mensaje de cliente", (msg) => {
        if (admins.length === 0) {
            socket.emit("no admin", "")
        } else {
            let client = activeChats.find((client) => client.clientId === socket.id)
            let targetAdminId
            if (client) {
                targetAdminId = client.adminId
            } else {
                let admin = get_random(admins)
                activeChats.push({clientId: socket.id, adminId: admin.id})
                targetAdminId = admin.id
            }
            socket.broadcast.to(targetAdminId).emit("mensaje servidor del cliente a admin", {
                user: socket.id,
                message: msg,
            })
        }
    })
    socket.on("mensaje de admin", ({user, message})=> {
        socket.broadcast.to(user).emit("mensaje servidor del admin a cliente", message)
    })

    socket.on("admin cierra el chat", (socketId) => {
        socket.broadcast.to(socketId).emit("Admin cerro el chat", "")
        let c = io.sockets.sockets.get(socketId)
        c.disconnect()
    })


    socket.on("disconnect", (reason) => {
        //admin desconectado
        const removeIndex = admins.findIndex((item) => item.id === socket.id)
        if (removeIndex !== -1) {
            admins.splice(removeIndex, 1)
        }
        activeChats = activeChats.filter((item) => item.adminId !== socket.id)

        //cliente desconecta
        const removeIndexClient = activeChats.findIndex((item) => item.clientId === socket.id)
        if (removeIndexClient !== -1) {
            activeChats.splice(removeIndexClient, 1)
        }
        socket.broadcast.emit("disconnected", {reason: reason, socketId: socket.id})
    })
})

const apiRoutes = require ("./routes/apiRoutes")

app.get("/", async (req, res, next) => {
    res.json({message: "API running"})
    })

// mongoDB connection
const connectDB = require("./config/db")
connectDB()

app.use("/api", apiRoutes)

app.use((error, req, res, next) => {
    if (process.env.NODE_ENV === "development"){
        console.error(error)
    }
    next (error)
})
app.use((error, req, res, next) => {
    if (process.env.NODE_ENV === "development"){
        res.status(500).json({
            message: error.message,
            stack: error.stack,
        })
    }else{
        res.status(500).json({
            message: error.message,
        })
    }
})


const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => console.log(`Server corriendo en el puerto ${PORT}`))

