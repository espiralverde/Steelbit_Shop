import { Row, Col, Container, Form, Alert, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import CartItemComponent from "../../../components/CartItemComponent";
import {useParams} from "react-router-dom";
import { useEffect, useState } from "react";

import { logout } from "../../../redux/actions/userActions";
import { useDispatch } from "react-redux";

const OrderDetailsPageComponent = ({getOrder, markAsDelivered}) => {
    const {id} = useParams()
    const dispatch = useDispatch()

    const [userInfo, setUserInfo] = useState({})
    const [paymentMethod, setPaymentMethod] = useState("")
    const [isPaid, setIsPaid] = useState(false)
    const [isDelivered, setIsDelivered] = useState(false)
    const [cartSubtotal, setCartSubtotal] = useState(0)
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [orderButtonMessage, setOrderButtonMessage] = useState("Marcar como Entregado")
    const [cartItems, setCartItems] = useState([])

    useEffect(() => {
        getOrder(id)
        .then((order) => {
            setUserInfo(order.user)
            setPaymentMethod(order.paymentMethod)
            order.isPaid ? setIsPaid(order.paidAt) : setIsPaid(false)
            order.isDelivered ? setIsDelivered(order.deliveredAt) : setIsDelivered(false)
            setCartSubtotal(order.orderTotal.cartSubtotal)
            if (order.isDelivered){
                setOrderButtonMessage("Orden Finalizada")
                setButtonDisabled(true)
            }
            setCartItems(order.cartItems)
        })
        .catch((er) => dispatch(logout()))
    }, [isDelivered, id])
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
                            <b>Dirección: </b> {userInfo.address} {userInfo.city} {userInfo.state} {userInfo.zipCode} <br />
                            <b>Teléfono: </b> {userInfo.phoneNumber} <br />
                        </Col>
                        <Col md={6}>
                            <h2>Forma de Pago</h2>
                            <Form.Select value={paymentMethod} disabled={true}>
                                <option value="PayPal">PayPal</option>
                                <option value="Efectivo">Efectivo/Contra Entrega</option>
                            </Form.Select>
                        </Col>
                        <Row>
                            <Col>
                                <Alert className="mt-3" variant={isDelivered ? "success" : "danger"}>
                                    {isDelivered ? <>Entregado el {isDelivered}</> : <>No Entregado</>}
                                </Alert>
                            </Col>
                            <Col>
                                <Alert className="mt-3" variant={isPaid ? "success" : "danger"}>
                                    {isPaid ? <>Pagado el {isPaid.substring(0,10)} </> : <>Sin Pagar</>}
                                </Alert>
                            </Col>
                        </Row>
                    </Row>
                    <br />
                    <h2>Order Items</h2>
                    <ListGroup variant="flush">
                        {cartItems.map((item, idx) => (
                            <CartItemComponent key={idx} item={item} orderCreated={true}/>
                        ))}
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <ListGroup>
                        <ListGroupItem>
                            <h3>Resumen</h3>
                        </ListGroupItem>
                        <ListGroupItem>
                            Precio: <span className="fw-bold">${parseFloat(cartSubtotal).toFixed(2)}</span>
                        </ListGroupItem>
                        <ListGroupItem>
                            Envío: <span className="fw-bold">Incluido</span>
                        </ListGroupItem>
                        <ListGroupItem>
                            Impuestos: <span className="fw-bold">Incluido</span>
                        </ListGroupItem>
                        <ListGroupItem className="text-danger">
                            Precio Final: <span className="fw-bold">ARS ${parseFloat(cartSubtotal).toFixed(2)}</span>
                        </ListGroupItem>
                        <ListGroupItem>
                            <div className="d-grid gap-2">
                                <Button size="lg" onClick={() => markAsDelivered(id).then((res) => {if (res) {
                                    setIsDelivered(true)}}).catch(er => console.log(er.response.data.message ? er.response.data.message : er.response.data))} disabled={buttonDisabled} variant="danger" type="button">{orderButtonMessage}</Button>
                            </div>
                        </ListGroupItem>
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    )
}

export default OrderDetailsPageComponent;