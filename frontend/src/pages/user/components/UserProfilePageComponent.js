import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Alert, Button} from "react-bootstrap";


const UserProfilePageComponent = ({updateUserApiRequest, fetchUser, userInfoFromRedux, setReduxUserState, reduxDispatch, localStorage, sessionStorage}) => {
    const [validated, setValidated] = useState(false);
    const [updateUserResponseState, setUpdateUserResponseState] = useState({success: "", error: ""})
    const [passwordsMatchState, setPasswordMatchState] = useState(true)
    const [user, setUser] = useState({})
    const userInfo = userInfoFromRedux

    useEffect(() => {
        fetchUser(userInfo._id)
        .then((data) => setUser(data))
        .catch((er) => console.log(er))
    }, [userInfo._id])

    
    const onChange = () => {
        const password = document.querySelector("input[name=password]")
        const confirmPassword = document.querySelector("input[name=confirmPassword]")
        if(confirmPassword.value === password.value) {
            setPasswordMatchState(true)
        }
        else{
            setPasswordMatchState(false)
        }
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget.elements;
        const name = form.name.value
        const lastName = form.lastName.value
        const phoneNumber = form.phoneNumber.value
        const address = form.address.value
        const country = form.country.value
        const zipCode = form.zipCode.value
        const city = form.city.value
        const state = form.state.value
        const password = form.password.value


        if (event.currentTarget.checkValidity() === true && form.password.value === form.confirmPassword.value) {
            updateUserApiRequest (name, lastName, phoneNumber, address, country, zipCode, city, state, password).then(data => 
                {setUpdateUserResponseState({success: data.success, error: ""})
            reduxDispatch(setReduxUserState({ doNotLogout: userInfo.doNotLogout, ...data.userUpdated}))

            if (userInfo.doNotLogout) localStorage.setItem("userInfo", JSON.stringify({doNotLogout: true, ...data.userUpdated}))
            else sessionStorage.setItem("userInfo", JSON.stringify({doNotLogout: false, ...data.userUpdated}))

        })
            .catch((er) => setUpdateUserResponseState({error: er.response.data.message ? er.response.data.message : er.response.data}))
    }
        setValidated(true);
    };

    return (
        <Container>
            <Row className="mt-5 justify-content-md-center">
                <Col md={6}>
                    <h1>Perfil de Usuario</h1>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="validationCustom01">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                defaultValue={user.name}
                                name="name"
                            />
                            <Form.Control.Feedback type="invalid">Ingrese su Nombre</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicLastName">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                defaultValue={user.lastName}
                                name="lastName"
                            />
                            <Form.Control.Feedback type="invalid">Ingrese su Apellido</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control
                                disabled
                                value={user.email}
                                //type="email"
                                //placeholder= "El correo no se puede modificar."
                                //name="email"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese su nro. de teléfono"
                                defaultValue={user.phoneNumber}
                                name="phoneNumber"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicAddress">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese su dirección"
                                defaultValue={user.address}
                                name="address"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicCountry">
                            <Form.Label>País</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese su país"
                                defaultValue={user.country}
                                name="country"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicZip">
                            <Form.Label>Código Postal</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese su código postal"
                                defaultValue={user.zipCode}
                                name="zipCode"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicCity">
                            <Form.Label>Ciudad</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese su ciudad"
                                defaultValue={user.city}
                                name="city"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicState">
                            <Form.Label>Provincia</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese su provincia"
                                defaultValue={user.state}
                                name="state"
                            />
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
                            <Form.Control.Feedback type="invalid">Las contraseñas no coinciden</Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="primary" type="submit">Actualizar</Button>
                        <Alert show={updateUserResponseState && updateUserResponseState.error !== ""} variant="danger">
                            Algo falló... (Ese Email ya está registrado!)
                        </Alert>
                        <Alert show={updateUserResponseState && updateUserResponseState.success === "Información de Usuario actualizada"} variant="info">
                            Usuario actualizado
                        </Alert>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default UserProfilePageComponent;