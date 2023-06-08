import { Carousel } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


const ProductCarouselComponent = ({bestSellers}) => {
    
    const cursorP = {
        cursor: "pointer"
    }


    
    return bestSellers.length > 0 ? (
        <Carousel>
            {bestSellers.map((item, idx) => (
                <Carousel.Item key={idx}>
                <img
                    crossOrigin="anonymous"
                    className="d-block w-100"
                    style={ {height: "300px", objectFit: "cover", opacity: 0.7 } } //objectFit arregla el ratio de la foto, para que salga centrada
                    src={item.images ? item.images[0].path : null}
                    alt="First slide"
                />
                <Carousel.Caption>
                    <LinkContainer style={cursorP} to={`/product-details/${item._id}`}>
                        <h3>El más vendido en {item.category}: {item.name}</h3> 
                        {/* acá tengo que corregir los nombres de como van a figurar las categorías */}
                    </LinkContainer>
                {/* <p style={{color: "black", fontSize: 18}}>{item.description}</p> */}
                {/* <p>{item.description}</p> */}
                    
                </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    ) : null
}

export default ProductCarouselComponent;



// <Carousel.Item>
// <img
//     crossOrigin="anonymous"
//     className="d-block w-100"
//     style={ {height: "300px", objectFit: "cover" } }
//     src="/images/carousel_1.jpg" //acá van las fotos que están en public/images: "/images/foto1.png"
//     alt="Second slide"
// />

// <Carousel.Caption>
// <LinkContainer style={cursorP} to="/product-details">
//         <h3>Sierra XXX-ZZZ</h3>
//     </LinkContainer>
//     <p>Descripción</p>
// </Carousel.Caption>
// </Carousel.Item>
// <Carousel.Item>
// <img
//     className="d-block w-100"
//     style={ {height: "300px", objectFit: "cover" } }
//     src="/images/carousel_1.jpg" //acá van las fotos que están en public/images: "/images/foto1.png"
//     alt="Third slide"
// />

// <Carousel.Caption>
//     <LinkContainer style={cursorP} to="/product-details">
//         <h3>Cortadora XXX-YYY</h3>
//     </LinkContainer>
//     <p>Descripción</p>
// </Carousel.Caption>
// </Carousel.Item>