import { Row, Col, Container, Alert, ListGroup, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import CartItemComponent from "../../components/CartItemComponent";

const CartPageComponent = ({addToCart, removeFromCart,  cartItems, cartSubtotal, reduxDispatch}) => {
    
    const changeCount = (productID, count) => {
        reduxDispatch(addToCart(productID, count))
    }
    const removeFromCartHandler = (productID, quantity, price) => {
        if (window.confirm("Desea eleminar el producto del Carrito?")){
            reduxDispatch(removeFromCart(productID, quantity, price))
        }
    }


    return (
        <Container fluid>
        <Row className="mt-4">
        <Col md={8}>
            <h1>Carrito</h1>
            {cartItems.length === 0 ? (
                <Alert variant="info">El Carrito está Vacío</Alert>
            ) : (
                <ListGroup variant="flush">
                {cartItems.map((item, idx) => (
                    <CartItemComponent 
                        item={item} 
                        key={idx} 
                        changeCount={changeCount} 
                        removeFromCartHandler={removeFromCartHandler} 
                    />
                ))}
                </ListGroup>
            )}
        </Col>
        <Col md={4}>
            <ListGroup>
            <ListGroup.Item>
                <h3>Subtotal ({cartItems.length} {cartItems.length === 1 ? "Producto" : "Productos"})</h3>
            </ListGroup.Item>
            <ListGroup.Item>
                Precio: <span className="fw-bold">{cartSubtotal}</span>
            </ListGroup.Item>
            <ListGroup.Item>
                <LinkContainer to="/user/cart-details">
                <Button disabled={cartSubtotal === 0} type="button"> Ordenar </Button>            
                </LinkContainer>
            </ListGroup.Item>
            </ListGroup>
        </Col>
        </Row>
        </Container>
    )
    } 

export default CartPageComponent;
