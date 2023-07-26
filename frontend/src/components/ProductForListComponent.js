import { Card, Button, Row, Col } from "react-bootstrap";
import {Rating} from "react-simple-star-rating";
import {LinkContainer} from "react-router-bootstrap";

const ProductForListComponent = ({productId, name, description, price, images, rating, reviewsNumber}) => {
  return (
    <Card style={{ marginTop: "30px", marginBottom: "30px"}}>
      <Row>
        <Col lg={3}>
          <Card.Img crossOrigin="anonymous" variant="top" src={images[0] ? images[0].path : ''} />
        </Col>
        <Col lg={9}>
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text>{description}</Card.Text>
            <Card.Text>
              <Rating readonly size={30} initialValue={rating} /> ({reviewsNumber})
            </Card.Text>
            <Card.Text className="h4">
              ${price}{" "}
              <LinkContainer to={`/product-details/${productId}`}>
                <Button variant="primary">Ver Producto</Button>
              </LinkContainer>
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductForListComponent;
