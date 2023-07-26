import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap"

import { logout } from "../../redux/actions/userActions";
import { useDispatch } from "react-redux";

const AdminLinksComponent = () => {
    const dispatch = useDispatch()

    return (
        <Navbar bg="light" variant="light">
            <Nav className="flex-column">
                <LinkContainer to="/admin/orders">
                    <Nav.Link>Pedidos</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/admin/products">
                    <Nav.Link>Productos</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/admin/chats">
                    <Nav.Link>Chats</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/admin/analytics">
                    <Nav.Link>Analytics</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/admin/price">
                    <Nav.Link>Precios</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/admin/users">
                    <Nav.Link>Usuarios</Nav.Link>
                </LinkContainer>
                <Nav.Link onClick={() => dispatch(logout())}>Salir</Nav.Link>
            </Nav>
        </Navbar>
    )

}

export default AdminLinksComponent;