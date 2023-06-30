import { Row, Col, Container, Form, Button} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"

const EditUserPageComponent = ({updateUserApiRequest, fetchUser}) => {
    const [validated, setValidated] = useState(false);
    const [user, setUser] = useState([])
    const [isAdminState, setIsAdminState] = useState(false)
    const [updateUserResponseState, setUpdateResponseState] = useState({message: "", error: ""})

    const {id} = useParams()
    const navigate = useNavigate()


    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget.elements;
        const name = form.name.value
        const lastName = form.lastName.value
        const email = form.email.value
        const isAdmin = form.isAdmin.checked

        if (event.currentTarget.checkValidity() === true) {
            updateUserApiRequest(id, name, lastName, email, isAdmin)
            .then(data=> {
                if (data === "Usuario actualizado") {
                    navigate("/admin/users")
                    }
                }
            )
            .catch(er => {
                setUpdateResponseState({error: er.response.data.message ? er.response.data.message : er.response.data})
            })
        }
        setValidated(true);
    };

    useEffect (() => {
        fetchUser(id)
        .then(data => {
            setUser(data)
            setIsAdminState(data.isAdmin)
        })
        .catch ((er) => console.log(er.response.data.message ? er.response.data.message : er.response.data))
    }, [id])

    return (
        <Container>
            <Row className="mt-5 justify-content-md-center">
                <Col md={1}>
                    <Link to="/admin/users" className="btn btn-primary my-3">Volver</Link>
                </Col>
                
                <Col md={6}>
                    <h1>Editar Usuario</h1>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicFirstName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control 
                                type="text" 
                                required
                                name="name" 
                                defaultValue={user.name}
                                />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicLastName">
                                <Form.Label>Apellido</Form.Label>
                                <Form.Control 
                                    name="lastName" 
                                    required 
                                    type="text" 
                                    defaultValue={user.lastName}
                                    />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email" 
                                    required 
                                    defaultValue={user.email}
                                    />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                <Form.Check 
                                    type="checkbox" 
                                    name="isAdmin" 
                                    label="Es Admin"
                                    checked={isAdminState}
                                    onChange={(e) => setIsAdminState(e.target.checked)}
                                    />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Actualizar
                        </Button>
                        {updateUserResponseState.error}
                    </Form>
                </Col>
            </Row>

        </Container>
    )
}
export default EditUserPageComponent