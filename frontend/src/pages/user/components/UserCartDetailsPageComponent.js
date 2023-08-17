import { Row, Col, Container, Form, Alert, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import CartItemComponent from "../../../components/CartItemComponent"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
const UserCartDetailsPageComponent = ({cartItems, itemsCount, cartSubtotal, userInfo, addToCart, removeFromCart, reduxDispatch, getUser, createOrder}) => {

    const [buttonDisabled, setButtonSetDisabled] = useState(false)
    const [userAddress, setUserAddress] = useState(false)
    const [missingAddress, setMissingAddress] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("PayPal")

    const navigate = useNavigate()
    const changeCount = (productID, count) => {
        reduxDispatch(addToCart(productID, count))
    }

    const removeFromCartHandler = (productID, quantity, price) => {
        if (window.confirm("Eliminar producto?")) {
            reduxDispatch(removeFromCart(productID, quantity, price))
        }
    }

    useEffect(() => {
        getUser()
        .then((data) => {
            if (!data.address || !data.city || !data.country || !data.zipCode || !data.state || !data.phoneNumber){
                setButtonSetDisabled(true)
                setMissingAddress(". Para realizar la compra necesitas tener todos los datos personales cargados en tu Perfil")
            } else {
                setUserAddress ({address: data.address, city: data.city, country: data.country, zipCode: data.zipCode, state: data.state, phoneNumber: data.phoneNumber})
                setMissingAddress(false)
            }
        })
        .catch((er) => console.log(er.response.data.message ? er.response.data.message : er.response.data))
        // acá puedo usar un "dispatch(logout)" para sacarlo, poner un mensaje de que faltan campos obligatorios
    }, [userInfo._id])


    const orderHandler = () => {
        const orderData = {
            orderTotal: {
                itemsCount: itemsCount,
                cartSubtotal: cartSubtotal,
            },
            cartItems : cartItems.map(item => {
                return{
                    productID: item.productID,
                    name: item.name,
                    price: item.price,
                    image: {path: item.image ? (item.image.path ?? null) : null},
                    quantity: item.quantity,
                    count: item.count,
                }
            }),
            paymentMethod: paymentMethod,
        }
        createOrder(orderData)
        .then(data => {
            if (data) {
                navigate("/user/order-details/" + data._id)
            }
        })
        .catch((err) => console.log(err))
    }

    const choosePayment = (e) => {
        setPaymentMethod(e.target.value)
    }


    return (
        <Container fluid>
            <Row className="mt-4">
                <h1>Detalle del Carrito</h1>
                <Col md={8}>
                    <br />
                    <Row>
                        <Col md={6}>
                            <h2>Dirección de Entrega</h2>
                            <b>Nombre:</b> {userInfo.name} {userInfo.lastName} <br />
                            <b>Dirección:</b> {userAddress.address}, {userAddress.city}, {userAddress.state}, {userAddress.zipCode}  <br />
                            <b>Teléfono: </b> {userAddress.phoneNumber} <br />
                        </Col>
                        <Col md={6}>
                            <h2>Forma de Pago</h2>
                            <Form.Select onChange={choosePayment}>
                                <option value="PayPal">PayPal</option>
                                <option value="Efectivo">Efectivo</option>
                            </Form.Select>
                        </Col>
                        <Row>
                            <Col>
                                <Alert className="mt-3" variant="danger">
                                    No entregado
                                    {missingAddress}
                                </Alert>
                            </Col>
                            <Col>
                                <Alert className="mt-3" variant="danger">
                                    Pago no realizado
                                </Alert>
                            </Col>
                        </Row>
                    </Row>
                    <br />
                    <h2>Detalles de compra</h2>
                    <ListGroup variant="flush">
                        {cartItems.map((item, idx) => (<CartItemComponent item={item} key={idx} removeFromCartHandler={removeFromCartHandler} changeCount={changeCount} />
                        ))}
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <ListGroup>
                        <ListGroupItem>
                            <h3>Resumen</h3>
                        </ListGroupItem>
                        <ListGroupItem>
                            Precio: <span className="fw-bold">ARS ${parseFloat(cartSubtotal).toFixed(2)}</span>
                        </ListGroupItem>
                        <ListGroupItem>
                            Envío: <span className="fw-bold">Incluido</span>
                        </ListGroupItem>
                        <ListGroupItem>
                            Impuestos: <span className="fw-bold">Incluido</span>
                        </ListGroupItem>
                        <ListGroupItem className="text">
                            <h4>Precio Final: <span className="fw-bold">ARS ${parseFloat(cartSubtotal).toFixed(2)}</span></h4>
                        </ListGroupItem>
                        <ListGroupItem>
                            <div className="d-grid gap-2">
                                <Button size="lg" onClick={orderHandler} variant="primary" type="button" disabled={buttonDisabled}>Confirmar forma de pago</Button>
                            </div>
                        </ListGroupItem>
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    )
}

export default UserCartDetailsPageComponent;