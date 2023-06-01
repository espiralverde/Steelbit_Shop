import { Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";

import { useEffect, useState } from "react";
import { logout } from "../../../redux/actions/userActions";
import { useDispatch } from "react-redux";


const OrdersPageComponent = ({getOrders}) => {

    const [orders, setOrders] = useState([])
    const dispatch = useDispatch()
    useEffect(() => {
        getOrders()
        .then((orders) => setOrders(orders))
        .catch((er) => dispatch(logout()))

    }, [])

    return (
        <Row className="m-5">
            <Col md={2}>
                <AdminLinksComponent />
            </Col>
            <Col md={10}>
                <h1>Pedidos</h1>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Usuario</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Entregado</th>
                        <th>Método de Pago</th>
                        <th>Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, idx)=> (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>
                                    {order.user !=null ? (
                                        <>
                                            {order.user.name} {order.user.lastName}
                                        </>
                                    ) : null}                                
                                </td>
                                <td>{order.createdAt.substring(0,10)}</td>
                                <td>{order.orderTotal.cartSubtotal}</td>
                                <td>
                                    {order.isDelivered ? <i className="bi bi-check-lg text-success"></i> : <i className="bi bi-x-lg text-danger"></i>}                                    
                                </td>
                                <td>{order.paymentMethod}</td>
                                <td>
                                    <Link to={`/admin/order-details/${order._id}`}>Ir al pedido</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Col>
        </Row>
    )
}

export default OrdersPageComponent