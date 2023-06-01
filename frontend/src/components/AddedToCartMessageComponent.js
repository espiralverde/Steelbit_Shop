import {Alert, Button} from "react-bootstrap";
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";

const AddedToCartMessageComponent = ({showCartMessage, setShowCartMessage}) => {
    const navigate = useNavigate()

    const goBack = () => {
        navigate(-1)
    }

    return (
        <Alert show={showCartMessage} variant="success" onClose={() => setShowCartMessage(false)} dismissible>
        <Alert.Heading>Producto agregado al Carrito!</Alert.Heading>
        <p>
        <Button variant="success" onClick={goBack} >Seguir comprando</Button>{" "}
            <Link to="/cart">
                <Button variant="danger">Ir al Carrito</Button>                
            </Link>            
        </p>
        </Alert>
    )
}

export default AddedToCartMessageComponent;
