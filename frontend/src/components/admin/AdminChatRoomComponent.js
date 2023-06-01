import { Fragment, useEffect, useState } from "react";
import { Button, Form, Toast } from "react-bootstrap";
import { setMessageReceived } from "../../redux/actions/chatActions";
import { useDispatch } from "react-redux";


const AdminChatRoomComponent =  ({chatRoom, roomIndex, socket, socketUser}) => {

    const dispatch = useDispatch();

    [window["toast" + roomIndex], window["closeToast" + roomIndex]] = useState(true)
    const [rerender, setRerender] = useState(false)

    const close = (socketId) => {
        window["closeToast" + roomIndex](false)
        socket.emit("admin cierra el chat", socketId)
    }

    const adminSubmitChatMsg = (e, elem) => {
        e.preventDefault()
        if (e.keyCode && e.keyCode !== 13) {
            return
        }
        const msg = document.getElementById(elem)
        let v = msg.value.trim()
        if (v === "" || v === null || v === false || !v) {
            return
        }
        chatRoom[1].push({admin: msg.value})
        socket.emit("mensaje de admin", {
            user: socketUser,
            message: v,
        })
        setRerender(!rerender)
        msg.focus()
        dispatch(setMessageReceived(false))
        setTimeout(() => {
            msg.value = ""
            const chatMessages = document.querySelector(`.chat-msg${socketUser}`)
            if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight
        }, 200)
        
    }

    useEffect(() => {
        const chatMessages = document.querySelector(`.chat-msg${socketUser}`)
        if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight
    })



    return (
        <>
            <Toast 
                show={"toast" + roomIndex} 
                onClose={() => close(chatRoom[0])} 
                className="ms-4 mb-5"
            >
                <Toast.Header>
                    <strong className="me-auto">Chat con Usuario</strong>
                </Toast.Header>
                <Toast.Body>
                    <div className={`chat-msg${socketUser}`} style={{maxHeight: "250px", overflow: "auto"}}>
                        {chatRoom[1].map((msg,idx) => (
                            <Fragment key={idx}>
                                {msg.client && (
                                    <p key={idx} className="bg-primary p-3 ms-4 text-light rounded-pill">
                                        <b>Usuario: </b> {msg.client}
                                    </p>
                                )}
                                {msg.admin && (
                                    <p key={idx}>
                                        <b>Admin: </b> {msg.admin}
                                    </p>
                                )}
                            </Fragment>
                    ))}
                    </div>
                    <Form>
                        <Form.Group className="mb-3" controlId={`adminChatMsg${roomIndex}`}>
                            <Form.Label>Escriba un mensaje</Form.Label>
                            <Form.Control onKeyUp={(e) => adminSubmitChatMsg(e, `adminChatMsg${roomIndex}`)} as="textarea" rows={2} />
                        </Form.Group>
                        <Button onClick={(e) => adminSubmitChatMsg(e, `adminChatMsg${roomIndex}`)} variant="primary" type="submit">Enviar</Button>
                    </Form>
                </Toast.Body>
            </Toast>
        </>

    )

    
    
}

export default AdminChatRoomComponent