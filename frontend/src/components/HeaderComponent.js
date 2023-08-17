import { Navbar, Nav, Container, NavDropdown, Badge, Form, Dropdown, DropdownButton, Button, InputGroup } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/actions/userActions';
import {useDispatch, useSelector} from "react-redux"
import { getCategories } from '../redux/actions/categoryActions';
import { useEffect, useState } from 'react';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import socketIOClient from "socket.io-client"
import { setChatRooms, setSocket, setMessageReceived, removeChatRoom } from '../redux/actions/chatActions';

const HeaderComponent = () => {
    const dispatch = useDispatch()
    const {userInfo} = useSelector((state) => state.userRegisterLogin)  //de acá saco el estado del usuario que se loguea
    const itemsCount = useSelector((state) => state.cart.itemsCount) // para tomar el dato del "indicador de productos" de carrito
    const {categories} = useSelector((state) => state.getCategories)
    const {messageReceived} = useSelector((state) => state.adminChat) //esto es para tomar el botón rojo del aviso del chat

    const [searchCategoryToogle, setSearchCategoryToogle] = useState("Categorías")
    const [searchQuery, setSearchQuery] = useState("")

    const navigate = useNavigate()

    useEffect (() => {
        dispatch(getCategories())
    }, [dispatch])

    const submitHandler = (e) => {
        if (e.keyCode && e.keyCode !== 13) return
        e.preventDefault()
        
        if (searchQuery.trim()) {
            if (searchCategoryToogle === "Categorías") {
                navigate (`/product-list/search/${searchQuery}`)
            } else {
                //ORIGINAL
                //navigate(`/product-list/category/${searchCategoryToogle.replaceAll("/", ",")}/search/${searchQuery}`)
                //Para Render.com
                navigate(`/product-list/category/${searchCategoryToogle.replace(/\//g, ",")}/search/${searchQuery}`)
            }
        } else if (searchCategoryToogle !== "Categorías") {
            //ORIGINAL
            //navigate(`/product-list/category/${searchCategoryToogle.replaceAll("/", ",")}`)
            //PARA RENDER.COM
            navigate(`/product-list/category/${searchCategoryToogle.replace(/\//g, ",")}`)
        } else {
            navigate("/product-list")
        }
    }

    useEffect(() => {
        if (userInfo.isAdmin) {
            // var audio = new Audio("/audio/chat-msg.mp3") // Le saco el audio para que no le suene muchas veces al Admin
            const socket = socketIOClient()
            socket.emit("admin conectado con el server", "Admin" + Math.floor(Math.random() * 1000000000000))
            socket.on("mensaje servidor del cliente a admin", ({user, message}) => {
                dispatch(setSocket(socket))
                dispatch(setChatRooms(user, message))
                dispatch(setMessageReceived(true))
                // audio.play()
            })
            socket.on("disconnected", ({reason, socketId}) => {
                // console.log(socketId, reason)
                dispatch(removeChatRoom(socketId))
            })
            return () => socket.disconnect()
        }
    }, [userInfo.isAdmin])

    return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>

        {/* <a class="navbar-brand" href="/">
            <img src="/images/Logo_Steelbit.png" alt="" width="80" height="40" />
        </a> */}


            <LinkContainer to="/">
                <Navbar.Brand href="/">SteelBit Shop</Navbar.Brand>            
            </LinkContainer>
            
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    <InputGroup>
                        <DropdownButton id="dropdown-basic-button" title={searchCategoryToogle}>
                            <DropdownItem onClick={() => setSearchCategoryToogle("Categorías")}> Categorías </DropdownItem>
                            {categories.map((category, id) => (
                                <Dropdown.Item key={id} onClick={() => setSearchCategoryToogle(category.name)}>{category.name}</Dropdown.Item>
                            ))}
                        </DropdownButton>

                        <Form.Control onKeyUp={submitHandler} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Buscar..." />
                        <Button onClick={submitHandler} variant="primary">
                            <i className="bi bi-search"></i>
                        </Button>{' '}
                    </InputGroup>
                </Nav>
                
                <Nav>
                    {userInfo.isAdmin ? (
                        <LinkContainer to="/admin/orders">
                            <Nav.Link>
                                Admin
                                {messageReceived && <span className='position-absolute top-1 start-10 translate-middle p-2 bg-danger border border-light rounded-circle'></span>}
                            </Nav.Link>
                        </LinkContainer>
                        ) : userInfo.name && !userInfo.isAdmin ? (
                                <NavDropdown title={`${userInfo.name} ${userInfo.lastName}`} id="collasible-nav-dropdown">
                                    <NavDropdown.Item eventKey="/user/my-orders" as={Link} to="/user/my-orders">Mis Pedidos</NavDropdown.Item>
                                    <NavDropdown.Item eventKey="/user" as={Link} to="/user">Perfil</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => dispatch(logout())}>Salir</NavDropdown.Item>
                                </NavDropdown>
                        ) : (
                                <>
                                    <LinkContainer  to="/login">
                                        <Nav.Link>
                                            Ingresar
                                        </Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/register">
                                        <Nav.Link>
                                            Registrarse
                                        </Nav.Link>
                                    </LinkContainer>
                                </>
                            )
                    }


                    <LinkContainer to="/cart">
                        <Nav.Link>
                            <Badge pill bg="danger">
                                {itemsCount === 0 ? "" : itemsCount}
                            </Badge>{' '}
                                <i className="bi bi-cart-dash"></i>
                                <span className="ms-1"></span>
                                Carrito
                        </Nav.Link>
                    </LinkContainer>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
    )
}

export default HeaderComponent;