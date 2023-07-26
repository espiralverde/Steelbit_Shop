import { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const UserOrdersPageComponent = ({getOrders}) => {

    const [orders, setOrders] = useState([])

    useEffect (() => {
        getOrders()
        .then(orders => setOrders( orders ))
        .catch((er) => console.log(er))
    }, [])

    return (
        <div className="container">
        <Row className="m-5">
            <Col md={10} >
                <h1>Mis Pedidos</h1>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr align="center">
                        {/* <th>#</th>*/}
                        {/* <th>Usuario</th>  */}
                        <th >Fecha</th>
                        <th >Total</th>
                        <th >Entregado</th>
                        <th >Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, idx)=> (
                            <tr key={idx}>
                                {/* <td>{idx + 1}</td> */}
                                {/* <td> {order.cartItems[0].image.path}</td> */}
                                <td align="center">{order.createdAt.substring(0,10)}</td>
                                <td align="right">{parseFloat(order.orderTotal.cartSubtotal).toFixed(2)}</td>
                                <td align="center">
                                    {order.isDelivered ? <i className="bi bi-check-lg text-success"></i> : <i className="bi bi-x-lg text-danger"></i>}                                    
                                </td>
                                <td align="center">
                                    <Link to={`/user/order-details/${order._id}`}>Ir al pedido</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Col>
        </Row>
        </div>
    )
}

export default UserOrdersPageComponent;