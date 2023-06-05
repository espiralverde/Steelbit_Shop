import { Form } from "react-bootstrap";

const PriceFilterComponent = ({price, setPrice}) => {
  return (
    <>
      <Form.Label>
        <span className="fw-bold">Precio no mayor a: </span> ${price}
      </Form.Label>
      {/* con esto manejo los valores del filtro de precios en productList */}
      <Form.Range min={1000} max={200000} step={10} onChange={(e) => setPrice(e.target.value)} /> 
    </>
  );
};

export default PriceFilterComponent;
