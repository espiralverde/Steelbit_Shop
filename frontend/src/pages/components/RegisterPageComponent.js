import { useState } from "react";
import { Container, Row, Col, Form, Alert, Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

const RegisterPageComponent = ({registerUserApiRequest, reduxDispatch, setReduxUserState}) => {
    const [validated, setValidated] = useState(false);
    const [registerUserResponseState, setRegisterUserResponseState] = useState({success: "", error: "", loading: false})
    const [passwordsMatchState, setPasswordsMatchState] = useState(true)

    const onChange = () => {
        const password = document.querySelector("input[name=password]")
        const confirmPassword = document.querySelector("input[name=confirmPassword]")
        if(confirmPassword.value === password.value) {
            setPasswordsMatchState(true)
        }
        else{
            setPasswordsMatchState(false)
        }
    }
    
    const handleSubmit = (event) => {
        event.preventDefault()
        event.stopPropagation()
        const form = event.currentTarget.elements
        const email = form.email.value
        const name = form.name.value
        const lastName = form.lastName.value
        const password = form.password.value

        if (event.currentTarget.checkValidity() === true && email &&  password && name && lastName && form.password.value === form.confirmPassword.value) {
            setRegisterUserResponseState({loading: true})
            registerUserApiRequest(name, lastName, email, password)
            .then((data) => {
                setRegisterUserResponseState({sucess: data.success, loading: false})
                reduxDispatch(setReduxUserState(data.userCreated))
            })
            .catch((er) => setRegisterUserResponseState({error: er.response.data.message ? er.response.data.message : er.response.data}))
        }
        setValidated(true);
    };



    return (
        <Container>
            <Row className="mt-5 justify-content-md-center">
                <Col md={6}>
                    <h1>Registro</h1>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="validationCustom01">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Ingrese su nombre"
                                name="name"
                            />
                            <Form.Control.Feedback type="invalid">Ingrese su Nombre</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicLastName">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Ingrese su apellido"
                                name="lastName"
                            />
                            <Form.Control.Feedback type="invalid">Ingrese su Apellido</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control
                                required
                                type="email"
                                placeholder="Ingrese su e-mail"
                                name="email"
                            />
                            <Form.Control.Feedback type="invalid">Ingrese un email válido</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                placeholder="Ingrese su contraseña"
                                name="password"
                                minLength={6}
                                onChange={onChange}
                                isInvalid={!passwordsMatchState}
                            />
                            <Form.Control.Feedback type="invalid">Ingrese una contraseña válida.</Form.Control.Feedback>
                            <Form.Text className="text-muted">La contraseña debe tener un mínimo de 6 caracteres</Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPasswordRepeat">
                            <Form.Label>Confirmar Contraseña</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                placeholder="Ingrese su contraseña"
                                name="confirmPassword"
                                minLength={6}
                                onChange={onChange}
                                isInvalid={!passwordsMatchState}
                            />
                            <Form.Control.Feedback type="invalid">No coinciden las contraseñas</Form.Control.Feedback>
                        </Form.Group>

                        <Row className="pb-2">
                            <Col>
                            Ya está registrado?
                            <Link to={"/login"}> Login </Link>

                            </Col>
                        </Row>


                        <Button type="submit">
                            {registerUserResponseState && registerUserResponseState.loading === true ? (
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            ) : ("")}
                        Enviar
                        </Button>
                        <Alert show={registerUserResponseState && registerUserResponseState.error === "El usuario ya existe"} variant="danger">
                            Ese Email ya está registrado!
                        </Alert>
                        <Alert show={registerUserResponseState && registerUserResponseState.success === "Usuario creado"} variant="info">
                            Usuario Creado
                        </Alert>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default RegisterPageComponent;