import { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const UserOrdersPageComponent = ({getOrders}) => {

    const [orders, setOrders] = useState([])

    useEffect (() => {
        getOrders()
        .then(orders => setOrders(orders))
        .catch((er) => console.log(er))
    }, [])


    return (
        <Row className="m-5">
            <Col md={12}>
                <h1>Mis Pedidos</h1>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Usuario</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Entregado</th>
                        <th>Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, idx)=> (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>Tú</td>
                                <td>{order.createdAt.substring(0,10)}</td>
                                <td>{order.orderTotal.cartSubtotal}</td>
                                <td>
                                    {order.isDelivered ? <i className="bi bi-check-lg text-success"></i> : <i className="bi bi-x-lg text-danger"></i>}                                    
                                </td>
                                <td>
                                    <Link to={`/user/order-details/${order._id}`}>Ir al pedido</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Col>
        </Row>
    )
}

export default UserOrdersPageComponent;