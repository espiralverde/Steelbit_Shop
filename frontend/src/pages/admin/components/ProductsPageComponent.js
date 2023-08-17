import { Col, Row, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";
import BulkUpdateComponent from "./BulkUpdateComponent";


import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from "react-bootstrap-table2-paginator"
import filterFactory, {textFilter, selectFilter} from "react-bootstrap-table2-filter"

import { useState, useEffect } from "react";
import { logout } from "../../../redux/actions/userActions";
import { useDispatch } from "react-redux";


const ProductsPageComponent = ({fetchProducts, deleteProduct}) => {
    
    const [products, setProducts] = useState([])
    const [productDeleted, setProductDeleted] = useState(false)
    const dispatch = useDispatch()
    
    const deleteHandler = async (productId) => {
        if (window.confirm("Borrar el producto?")){
            const data = await deleteProduct(productId)
            if (data.message === "Producto Borrado") {  //texto que viene del productController.js
                setProductDeleted(!productDeleted)
            }
        }
    }
    useEffect(() => {
        const abctrl = new AbortController();
        fetchProducts(abctrl)
        .then((res) => setProducts(res))
        //.catch((er) => console.log(er.response.data.message ? er.response.data.message : er.response.data)
        .catch((er) => dispatch(logout())
        //setProducts ([{name: er.response.data.message ? er.response.data.message : er.response.data}])
        )
        return () => abctrl.abort()
    }, [productDeleted])

    const headerFormatter = (column, _colIndex, { sortElement, filterElement }) => {
        return (
            <div style={{ display: "flex", flexDirection: "column", className: ""}}>
                {filterElement}
                <span>{column.text} {sortElement}</span>
                
            </div>
        );
    };

    const  pagination = paginationFactory({
        sizePerPage: 20,
    })

    const selectOptions = {
        Eléctricas: 'Eléctricas',
        Neumáticas: 'Neumáticas',
        Inalámbricas: 'Inalámbricas',
        Manuales: "Manuales"
    };

    const qualityFilter = selectFilter({
        options: selectOptions,
        placeholder: 'Seleccionar Categoría',
        caseSensitive: false,
    });

    function priceFormatter(column, colIndex) {
        return (
            <h5><strong>$$ { column.text } $$</strong></h5>
        );
    }

    const columns = [
        {   
            dataField: '_id',
            text: 'ID',
            headerAlign: 'center',
            sort: true,
            hidden: true,
        },
        {   
            dataField: 'category' ,
            text: 'Categoría',
            headerAlign: 'center',
            align: 'center',
            sort: true,
            headerFormatter: headerFormatter,
            filter: qualityFilter,
        },
        {
            dataField: 'name',
            text: 'Herramienta',
            headerAlign: 'center',
            align: 'center',
            sort: true,
            filter: textFilter({placeholder: "Buscar..."}),
            headerFormatter: headerFormatter
        },
        {
            dataField: 'price',
            text: 'Precio',
            headerAlign: 'center',
            align: 'center',
            sort: true,
            filter: textFilter({placeholder: "Buscar..."}),
            headerFormatter: headerFormatter,
            formatter: (cell) => parseFloat(cell).toFixed(2),
        },
        {   
            dataField: '_id' ,
            text: 'Editar',
            headerAlign: 'center',
            align: 'center',
            sort: true,
            formatter: (cell, _row) => {
                return (
                    <div>
                            <LinkContainer to={`/admin/edit-product/${cell}`}>
                                <Button className="btn-md me-2">
                                    <i className="bi bi-pencil-square"></i>
                                </Button>
                            </LinkContainer> {" "}
                        <Button variant="danger" className="btn-md" onClick={() => deleteHandler(cell)}>
                            <i className="bi bi-x-circle"></i>
                        </Button>
                    </div>
                )
            }
        },
    ]

    return (
        <Row className="mt-5">
            <Col md={2}>
                <AdminLinksComponent />
            </Col>

            <Col md={10}>
                <h1>Productos{" "}
                    <LinkContainer to="/admin/create-new-product">
                        <Button variant="primary" size="sm">
                            Agregar
                        </Button>
                    </LinkContainer>
                </h1>
                
                <BootstrapTable
                keyField='_id' 
                data={ products } 
                columns={ columns } 
                bootstrap4
                striped 
                bordered 
                hover 
                responsive
                pagination={pagination}
                filter={filterFactory()}
                sort={ { dataField: 'name', order: 'asc' } }
                />
            </Col>
        </Row>
    )
}

export default ProductsPageComponent