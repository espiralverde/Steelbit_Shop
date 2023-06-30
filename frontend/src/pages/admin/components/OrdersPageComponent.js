import { Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from "react-bootstrap-table2-paginator"
import filterFactory, {textFilter, selectFilter, dateFilter} from "react-bootstrap-table2-filter"
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

    const  pagination = paginationFactory({
        sizePerPage: 10,
        //acá agrego todas las características que quiero de la paginación
    })

    const selectOptions = {
        pp: 'pp',
        PayPal: 'PayPal',
        cod: 'Efectivo'
    };

    const qualityFilter = selectFilter({
        options: selectOptions,
        placeholder: 'Seleccionar',  // custom the input placeholder
        //className: 'sr-only', // custom classname on input
        //defaultValue: '2', // default filtering value
        // comparator: Comparator.LIKE, // default is Comparator.EQ
        caseSensitive: false, // default is true
        //style: { color: "red" }, // your custom styles on input
        // withoutEmptyOption: true,  // hide the default select option
    });

    const headerFormatter = (column, colIndex, { sortElement, filterElement }) => {
        
        return (
            <div style={{ display: "flex", flexDirection: "column", className: ""}}>
                {filterElement}
                <span>{column.text} {sortElement}</span>
                
            </div>
        );
    };

const columns = [
    {   
        dataField: '_id',
        text: 'ID',
        headerAlign: 'center',
        sort: true,
        hidden: true,
    },
    {   
        dataField: 'user.name' ,
        text: 'Nombre',
        headerAlign: 'center',
        align: 'center',
        sort: true,

    },
    {
        dataField: 'user.lastName',
        text: 'Apellido',
        headerAlign: 'center',
        align: 'center',
        sort: true,
        filter: textFilter({placeholder: "Buscar..."}),
        headerFormatter: headerFormatter,
        //headerStyle: { backgroundColor: 'green' }

    },
    {
        dataField: 'createdAt',
        text: 'Fecha',
        headerAlign: 'center',
        align: 'center',
        //filter: dateFilter(),
        sort: true,
        formatter: (cell) => cell.substring(0, 10),
    },
    {
        dataField: 'isDelivered',
        text: 'Entregado',
        headerAlign: 'center',
        align: 'center',
        sort: true,
        formatter: (cellContent, _row) => {
            if (cellContent !== false)
                return (
                <p className="text-success">
                    <span >Si</span>
                </p>
                );
            return (
                <p className="bg-danger text-white rounded-pill">
                <span> Sin entregar </span>
                </p>
            );
        }
    },
    {
        dataField: 'paymentMethod',
        text: 'Forma de pago',
        headerAlign: 'center',
        align: 'center',
        sort: true,
        filter: qualityFilter,
        headerFormatter: headerFormatter
    },
    {
        dataField: 'orderTotal.cartSubtotal',
        text: 'Total',
        headerAlign: 'right',
        align: 'right',
        formatter: (cell) => parseFloat(cell).toFixed(2),
        sort: true,
    },
    {
        dataField: '_id',
        text: 'Detalle',
        headerAlign: 'center',
        align: 'center',
        accessor: 'link',
        formatter: (cell) => <a target="_blank" href={`/admin/order-details/${cell}`}> Ver Detalle</a>
        
    },
]


    return (
    <div>
        <Row className="m-5">
            <Col md={2}>
                <AdminLinksComponent />
            </Col>
            <Col>
                <BootstrapTable
                keyField='_id' 
                data={ orders } 
                columns={ columns } 
                bootstrap4
                striped 
                bordered 
                hover 
                responsive
                pagination={pagination}
                filter={filterFactory()}
                sort={ { dataField: 'createdAt', order: 'desc' } } //así siempre muestra el más nuevo primero
                />
            </Col>
        </Row>
    </div>
    )

}

export default OrdersPageComponent