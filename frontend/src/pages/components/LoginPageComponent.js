import { useState } from "react";
import { Container, Row, Col, Form, Alert, Button} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

const LoginPageComponent = ({loginUserApiRequest, reduxDispatch, setReduxUserState}) => {
    const [validated, setValidated] = useState(false);
    const [loginUserResponseState, setLoginUserResponseState] = useState({
        success: "", error: "", loading: false})

    const navigate = useNavigate();
    
    
    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget.elements;
        const email = form.email.value;
        const password = form.password.value;
        const doNotLogout = form.doNotLogout.checked


        if (event.currentTarget.checkValidity() === true && email && password) {
            setLoginUserResponseState({loading: true});

            loginUserApiRequest(email, password, doNotLogout)
            .then((res) => {
                setLoginUserResponseState ({success: res.success, loading: false, error: ""})

                if (res.userLoggedIn) {
                    reduxDispatch(setReduxUserState(res.userLoggedIn))
                }


            if (res.success === "Usuario logueado" && !res.userLoggedIn.isAdmin) window.location.assign("/user")
            else window.location.assign("/admin/orders")
        })
            .catch((er) => setLoginUserResponseState ({error: er.response.data.message ? er.response.data.message : er.response.data}))
    }
        setValidated(true);
    };

    return (
        <Container>
            <Row className="mt-5 justify-content-md-center">
                <Col md={6}>
                    <h1>Login</h1>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control
                                required
                                type="email"
                                placeholder="Ingrese su e-mail"
                                name="email"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                placeholder="Ingrese su contraseña"
                                name="password"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check
                                type="checkbox"
                                name="doNotLogout"
                                label="No cerrar sesión"
                            />
                        </Form.Group>
                        <Row className="pb-2">
                            <Col>
                                No está registrado?
                                <Link to={"/register"}> Registrar Usuario </Link>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit">
                            {loginUserResponseState && loginUserResponseState.loading === true ? (
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            ) : (
                                ""
                                )}
                        Login
                        </Button>
                        <Alert show={loginUserResponseState && loginUserResponseState.error === "Credenciales incorrectas"} variant="danger">
                            Usuario/Contraseña incorrecta
                        </Alert>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default LoginPageComponent;