import { Button, Col, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from "react-bootstrap-table2-paginator"
import filterFactory, {textFilter} from "react-bootstrap-table2-filter"


import { useState, useEffect } from "react";
import { logout } from "../../../redux/actions/userActions";
import { useDispatch } from "react-redux";



const UsersPageComponent = ({fetchUsers, deleteUser}) => {
    const [users, setUsers] = useState([])
    const [userDeleted, setUserDeleted] = useState(false)
    const dispatch = useDispatch()

    const deleteHandler = async (userId) => {
        if (window.confirm ("Está seguro?")) {
            const data = await deleteUser(userId)
            if (data === "Usuario borrado") {// esto viene del texto del borrado de userController.js
                setUserDeleted(!userDeleted)
            }
        }
    }

    //con esto hago el cancel a ir a la BD si hago clic en otro link de la página de usuarios
useEffect(() => { 
    const abctrl = new AbortController();
    fetchUsers(abctrl)
    .then((res) => setUsers(res))
    .catch((er) => dispatch(logout())
    )
    return () => abctrl.abort()
},[userDeleted])

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

const columns = [
    {   
        dataField: '_id',
        text: 'ID',
        headerAlign: 'center',
        sort: true,
        hidden: true,
    },
    {   
        dataField: 'lastName' ,
        text: 'Apellido',
        headerAlign: 'center',
        align: 'center',
        sort: true,
        filter: textFilter({placeholder: "Buscar..."}),
        headerFormatter: headerFormatter,
    },
    {
        dataField: 'name',
        text: 'Nombre',
        headerAlign: 'center',
        align: 'center',
        sort: true,
        headerFormatter: headerFormatter
    },
    {
        dataField: 'email',
        text: 'e-mail',
        headerAlign: 'center',
        align: 'center',
        sort: true,
        filter: textFilter({placeholder: "Buscar..."}),
        headerFormatter: headerFormatter
    },
    {
        dataField: 'isAdmin',
        text: 'Admin',
        headerAlign: 'center',
        align: 'center',
        sort: true,
        headerFormatter: headerFormatter,
        formatter: (cellContent, _row) => {
            if (cellContent !== false)
                return (
                    <p style={{justifyContent: "center", margin: "auto"}} className="bg-success text-white rounded-pill">
                            <span style={{justifyContent: "center"}}>Admin</span>
                    </p>
                    );
                return (
                    <p style={{justifyContent: "center", margin: "auto"}}>
                        <span style={{justifyContent: "center"}}> No </span>
                    </p>
                );
            }
    },
    {   
        dataField: '_id' ,
        text: 'Editar',
        headerAlign: 'center',
        align: 'center',
        sort: false,
        formatter: (cell, _row) => {
            return (
                <div>
                        <LinkContainer to={`/admin/edit-user/${cell}`}>
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
    }
]


    return (

            <Row className="mt-5">
                <Col md={2}>
                    <AdminLinksComponent />
                </Col>

                <Col md={10}>
                    <h1>Lista de Usuarios</h1>
                    <BootstrapTable
                    keyField='_id' 
                    data={ users } 
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

export default UsersPageComponent
