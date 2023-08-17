import { Container, Row, Col } from 'react-bootstrap';

const FooterComponent = () => {

   return (
      <footer>
         <Container fluid>
            <Row className='pie'>
               <Col md={1} className='bg-dark text-white text-center py-3'>
                  <a href="/">
                     <img src="/images/Logo_Steelbit.png" alt="" width="150" height="75" />
                  </a> 
                  </Col>
                  <Col className="py-3 bg-dark text-white text-center" md={11}>
                     <p>SteelBit SRL</p>
                     <p>info@steelbit.com.ar</p>
                     <p>Av. Colón 5000</p>
                     <p>Córdoba - Argentina</p>
                  </Col>
            </Row>
         </Container>
      </footer>   
   )
}

export default FooterComponent;