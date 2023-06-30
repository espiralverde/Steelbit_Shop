import { Row, Col, Container, Form, Alert, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import CartItemComponent from "../../../components/CartItemComponent"
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"

import {useDispatch} from "react-redux"
import { clearCart } from "../../../redux/actions/cartActions";


const UserOrderDetailsPageComponent = ({userInfo, getUser, getOrder, loadPayPalScript, initMercadoPago}) => {

    const [userAddress, setUserAddress] = useState({})
    const [paymentMethod, setPaymentMethod] = useState("")
    const [isPaid, setIsPaid] = useState(false)
    const [orderButtonMessage, setOrderButtonMessage] = useState("")
    const [cartItems, setCartItems] = useState([])
    const [cartSubtotal, setCartSubtotal] = useState(0)
    const [isDelivered, setIsDelivered] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(false)

    const paypalContainer = useRef()
    //   console.log(paypalContainer)
    //
    const navigate = useNavigate()
    const {id} = useParams()
    const dispatch = useDispatch()


    useEffect(() => {
        getUser()
        .then(data => {
            setUserAddress({address: data.address, city: data.city, country: data.country, zipCode: data.zipCode, state: data.state, phoneNumber: data.phoneNumber})
        })
        .catch((err) => console.log(err))
        
    }, [])

    useEffect(() => {
        getOrder(id)
        .then(data => {
            setPaymentMethod(data.paymentMethod)
            setCartItems(data.cartItems)
            setCartSubtotal(data.orderTotal.cartSubtotal)
            data.isDelivered ? setIsDelivered(data.deliveredAt) : setIsDelivered(false)
            data.isPaid ? setIsPaid(data.paidAt) : setIsPaid(false)
            if (data.isPaid) {
                setOrderButtonMessage("Compra finalizada")
                setButtonDisabled(true)
                //agregado un timeout para que redireccione a product-list
                // setTimeout(() => {
                //     navigate (`/product-list`)
                    
                // }, 5000)
            } else {
                if (data.paymentMethod === "pp") {
                    setOrderButtonMessage("Completar Pago")
                } else if (data.paymentMethod === "cod"){
                    setButtonDisabled(true)
                    setOrderButtonMessage("Pago en efectivo contra entrega")
                }
            }
        })
        .catch((err) => console.log(err))
    }, [])

    const orderHandler = () => {
        setButtonDisabled(true)
        if (paymentMethod === "pp") {
            setOrderButtonMessage("Para finalizar, seleccione su opción abajo")
            if (!isPaid) {
                loadPayPalScript(cartSubtotal, cartItems, id, updateStateAfterOrder)
            }        
        } else {
            setOrderButtonMessage ("Orden completada. Muchas Gracias!")
        }

    }

    const updateStateAfterOrder = (paidAt) => {
        setOrderButtonMessage("Gracias por su compra!")
        setIsPaid(paidAt)
        setButtonDisabled(true)
        paypalContainer.current.style = "display: none"
    }

    return (
        <Container fluid>
            <Row className="mt-4">
                <h1>Detalle de Compra</h1>
                <Col md={8}>
                    <br />
                    <Row>
                        <Col md={6}>
                            <h2>Dirección de Entrega</h2>
                            <b>Nombre: </b> {userInfo.name} {userInfo.lastName} <br />
                            <b>Dirección: </b>{userAddress.address}, {userAddress.city}, {userAddress.state}, {userAddress.zipCode} <br />
                            <b>Teléfono: </b> {userAddress.phoneNumber} <br />
                        </Col>
                        <Col md={6}>
                            <h2>Forma de Pago</h2>
                            <Form.Select value={paymentMethod} disabled={true}>
                                <option value="pp">PayPal</option>
                                <option value="cod">Efectivo</option>
                                <option value="mp">MercadoPago</option>
                            </Form.Select>
                        </Col>
                        <Row>
                            <Col>
                                <Alert className="mt-3" variant={isDelivered ? "success" : "danger"}>
                                    {isDelivered ? <>Entregado el {isDelivered.substring(0,10)}</> : <>No entregado</>}
                                </Alert>
                            </Col>
                            <Col>
                                <Alert className="mt-3" variant={isPaid ? "success" : "danger"}>
                                {isPaid ? <>Pagado el {isPaid.substring(0,10)}</> : <>Aún sin pagar</>}
                                </Alert>
                            </Col>
                        </Row>
                    </Row>
                    <br />
                    <h2>Detalles de compra</h2>
                    <ListGroup variant="flush">
                        {cartItems.map((item, idx)=> (
                            <CartItemComponent item={item} key={idx} orderCreated={true} />

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
                        <ListGroupItem className="text-danger">
                            <h4>Precio Final: <span className="fw-bold">ARS ${parseFloat(cartSubtotal).toFixed(2)}</span></h4>
                        </ListGroupItem>
                        <ListGroupItem>
                            <div className="d-grid gap-2 mb-2">
                                <Button 
                                    size="lg" 
                                    onClick={orderHandler} 
                                    variant="primary" 
                                    type="button" 
                                    disabled={buttonDisabled}
                                >
                                    {orderButtonMessage}
                                    {}
                                </Button>
                            </div>
                            {/* Estilos para los botones de pago */}
                            <div style={{position: "relative", zIndex:1}}>
                                <div ref={paypalContainer} id="paypal-container-element"></div>
                            </div>
                            <div className="d-grid gap-2">
                                    <Button
                                        size="lg" 
                                        onClick={() => dispatch(clearCart())} 
                                        variant="success" 
                                        type="button" 
                                    > Ir a la Tienda <span><i class="bi bi-shop"></i></span></Button> 
                                </div>
                        </ListGroupItem>
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    )
}

export default UserOrderDetailsPageComponent;