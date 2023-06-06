import { Container, Row, Col } from 'react-bootstrap';

const FooterComponent = () => {

   return (
      <footer>
         <Container fluid>
            <Row className='mt-5'>
               <Col className='bg-dark text-white text-center py-3'>
                  <a href="/">
                     <img src="/images/Logo_Steelbit.png" alt="" width="150" height="75" />
                  </a> 
                  {/* Copyright &copy; SteelBit */}
                  </Col>
            </Row>
         </Container>
      </footer>   
   )
}

export default FooterComponent;