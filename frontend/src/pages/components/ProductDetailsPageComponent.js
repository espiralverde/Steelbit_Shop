import {
    Row,
    Col,
    Container,
    Image,
    ListGroup,
    ListGroupItem,
    Form,
    Button,
    Alert,
  } from "react-bootstrap";
  import AddedToCartMessageComponent from "../../components/AddedToCartMessageComponent";
  import { Rating } from "react-simple-star-rating";
  import ImageZoom from "js-image-zoom";
  import { useState, useEffect, useRef } from "react";
  import { useParams } from "react-router-dom";

  
  const ProductDetailsPageComponent = ({
    addToCartReduxAction, 
    reduxDispatch, 
    getProductDetails,
    userInfo,
    writeReviewApiRequest
  }) => {

  
    const { id } = useParams()
    const [quantity, setQuantity] = useState(1)
    const [showCartMessage, setShowCartMessage] = useState(false)
    const [product, setProduct] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [productReviewed, setProductReviewed] = useState(false)

    const messagesEndRef = useRef(null)

    const addToCartHandler = () => {
      reduxDispatch(addToCartReduxAction(id, quantity))
      setShowCartMessage(true)
    }

    useEffect(() => {
      if (productReviewed) {
        setTimeout(() => {
          messagesEndRef.current.scrollIntoView({behavior: "smooth"})
        }, 100)
      }
    }, [productReviewed])


  
    useEffect(() => {
      if (product.images) {
        var options = {
          scale: 2,
          offset: { vertical: 0, horizontal: 0 },
        };
        product.images.map((image, id) => new ImageZoom(document.getElementById(`imageId${id +1}`), options ))
      }
    });

    useEffect(() => {
      getProductDetails(id)
      .then(data => {
        setProduct(data)
        setLoading(false)
      })
      .catch((er) => setError(er.response.data.message ? er.response.data.message : er.response.data))

    }, [id, productReviewed])

    const sendReviewHandler = (e) => {
      e.preventDefault()
      const form = e.currentTarget.elements
      const formInputs = {
        comment: form.comment.value,
        rating: form.rating.value,
      }
      if (e.currentTarget.checkValidity() === true ){
        writeReviewApiRequest(product._id, formInputs)
        .then(data => {
          if (data === "Review creada") {
            setProductReviewed("Review realizada con éxito!")
          }
        })
        .catch((er) => setProductReviewed(er.response.data.message ? er.response.data.message : er.response.data))
      }
    }
  
    return (
      <Container>
        {/* este es el mensaje que aparece cuando agrego un item al carrito */}
        <AddedToCartMessageComponent showCartMessage={showCartMessage} setShowCartMessage={setShowCartMessage}/> 
        <Row className="mt-5">

          {loading ? (
            <h2>Cargando detalles del producto...</h2>
          ) : error ? (
            <h2>{error}</h2>
          ) : (
            <>
              <Col style={{ zIndex: 1 }} md={4}>
                {product.images ? product.images.map((image, id) => (
                  <div key={id}>
                    <div key={id} id={`imageId${id + 1}`}>
                      <Image 
                        crossOrigin="anonymous" 
                        fluid 
                        src={`${image.path ?? null}`}
                      />
                    </div>
                      <br />
                  </div>
                )) : null}

              </Col>
              <Col md={8}>
                <Row>
                  <Col md={8}>
                    <ListGroup variant="flush">
                      <ListGroupItem>
                        <h1>{product.name}</h1>
                      </ListGroupItem>
                      <ListGroupItem>
                        <Rating readonly size={20} initialValue={product.rating} /> ({product.reviewsNumber})
                      </ListGroupItem>
                      <ListGroupItem>
                        <span className="fw-bold">${product.price}</span>
                      </ListGroupItem>
                      <ListGroupItem>{product.description}</ListGroupItem>
                    </ListGroup>
                  </Col>
                  <Col md={4}>
                    <ListGroup>
                      <ListGroupItem>Estado: {product.count > 0 ? "Disponible" : "Sin stock"}</ListGroupItem>
                      <ListGroupItem>
                        <span className="fw-bold">${product.price}</span>
                      </ListGroupItem>
                      <ListGroupItem>
                        Cantidad:
                        <Form.Select 
                          value={quantity} 
                          onChange={e => setQuantity(e.target.value)} 
                          size="lg" 
                          aria-label="Default select example"
                          >
                            {[...Array(product.count).keys()].map(x => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}

                        </Form.Select>
                      </ListGroupItem>
                      <ListGroupItem>
                        <Button onClick={addToCartHandler} variant="btn btn-outline-danger">Agregar al Carrito</Button>
                      </ListGroupItem>
                    </ListGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className="mt-5">
                    <h5> Opiniones del Producto </h5>
                    <ListGroup variant="flush">
                      {product.reviews && product.reviews.map((review, idx) => (

                        <ListGroupItem key={idx}>
                          {review.user.name} <br />
                          <Rating readonly size={20} initialValue={review.rating} />
                          <br />
                          {review.createdAt.substring(0,10)} <br />
                            {review.comment}
                        </ListGroupItem>
                      ))}
                      {/* esto es para que la barra de scroll se vaya hasta abajo cuando le doy al botón submit */}
                      <div ref={messagesEndRef} /> 

                    </ListGroup>
                  </Col>
                </Row>
                <hr />

                {/* con esto compruebo que si el usuario está logueado o no. Sino, le manda el mensaje de alerta */}
                {!userInfo.name && <Alert variant="danger">Debe iniciar sesión para dejar una opinión/valoración</Alert> }
                
                <Form onSubmit={sendReviewHandler}>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>Escribe una Opinion</Form.Label>
                    <Form.Control name="comment" required as="textarea" disabled={!userInfo.name} rows={3} />
                  </Form.Group>
                  <Form.Select name="rating" required disabled={!userInfo.name} aria-label="Default select example">
                    <option value=""> Valoración</option>
                    <option value="5"> 5 (Excelente)</option>
                    <option value="4"> 4 (Muy Bueno)</option>
                    <option value="3"> 3 (Bueno)</option>
                    <option value="3"> 2 (Malo)</option>
                    <option value="1"> 1 (Horrible)</option>
                  </Form.Select>
                  <Button disabled={!userInfo.name} type="submit" variant="primary" className="mb-3 mt-3">
                    Enviar
                  </Button>
                  {productReviewed}
                </Form>
              </Col>
            </>
          )}

        </Row>
      </Container>
    );
  };
  
  export default ProductDetailsPageComponent;
  