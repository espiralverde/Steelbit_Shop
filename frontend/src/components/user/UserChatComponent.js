import "../../chat.css";
import {useState, useEffect} from "react"
import socketIOClient from "socket.io-client"
import { useSelector } from "react-redux"


const UserChatComponent = () => {

    const [socket, setSocket] = useState(false)
    const [chat, setChat] = useState([])
    const [messageReceived, setMessageReceived] = useState(false)
    const [chatConnectionInfo, setChatConnectionInfo] = useState(false)
    const [reconnect, setReconnect] = useState(false)

    const userInfo = useSelector((state) => state.userRegisterLogin.userInfo)



    useEffect(() => {
        if (!userInfo.isAdmin) {
            setReconnect(false)
            var audio = new Audio("/audio/chat-msg.mp3")
            const socket = socketIOClient()
            socket.on("no admin", (msg) => {
                setChat((chat) => {
                    return[...chat, {admin: " Hola! Somos SteelBit :) Nuestro horario de atención personalizada es de 9:30 a 17:30 hs. Escribinos en ese horario para que podamos ayudarte."}]
                })
            })
            socket.on("mensaje servidor del admin a cliente", (msg) => {
                setChat((chat) => {
                    return[...chat, {admin: msg}]
                })
                setMessageReceived(true)
                audio.play()
                const chatMessages = document.querySelector(".chat-msg")
                chatMessages.scrollTop = chatMessages.scrollHeight
            })
            setSocket(socket)
            socket.on("Admin cerro el chat", () => {
                setChat([])
                setChatConnectionInfo("Conexión finalizada. Escribe un mensaje para reconectar.")
                setReconnect(true)
            })
            return () => socket.disconnect() //cuando cierro la página, el socket(chat) se desconecta
        }
    }, [userInfo.isAdmin, reconnect])

    const clientSubmitChatMsg = (e) => {
        if (e.keyCode && e.keyCode !==13) {
            return
        }
        setChatConnectionInfo("")
        setMessageReceived(false)
        const msg = document.getElementById("clientChatMsg")
        let v = msg.value.trim()
        if (v === "" || v === null || v === false || !v) {
            return
        }
        socket.emit("mensaje de cliente", v) //v es el mensaje que se envía al servidor, del cliente.
        setChat((chat) => {
            return [...chat, {client: v}]
        })
        msg.focus()
        setTimeout(() => {
            msg.value = ""
            const chatMessages = document.querySelector(".chat-msg")
            chatMessages.scrollTop = chatMessages.scrollHeight
        }, 200)
    }

    return !userInfo.isAdmin ? (
    <>
        <input type="checkbox" id="check" />
        <label className="chat-btn" htmlFor="check">
            <i className="bi bi-chat-dots comment"></i>
            {messageReceived && <span className="position-absolute top-0 start-10 translate-middle p-2 bg-danger border border-light rounded-circle"></span>}
            
            <i className="bi bi-x-circle close"></i>
        </label>
        <div className="chat-wrapper">
            <div className="chat-header bg-primary">
                <h6>SteelBit Chat</h6>
            </div>
            <div className="chat-form">
            <div className="chat-msg">
                <p>{chatConnectionInfo}</p>
                {chat.map((item, id) => (
                <div key={id}>
                    {item.client && (
                    <p>
                        <b>Usted:</b> {item.client}
                    </p>
                    )}
                    {item.admin && (
                    <p className="bg-primary p-3 ms-4 text-light">
                        <b>Soporte:</b> {item.admin}
                    </p>
                    )}
                </div>
                ))}
            </div>
            <textarea
                onKeyUp={(e) => clientSubmitChatMsg(e)}
                id="clientChatMsg"
                className="form-control"
                placeholder="Escriba su mensaje"
            ></textarea>
    
            <button
                onClick={(e) => clientSubmitChatMsg(e)}
                className="btn btn-primary btn-block"
            >
                Enviar
            </button>
            </div>
        </div>
    </>
        ) : null;
    };
    
    export default UserChatComponent;
    