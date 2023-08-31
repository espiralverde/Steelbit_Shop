import { Form } from "react-bootstrap";

const SortOptionsComponent = ({setSortOption}) => {
    return (
        <Form.Select
            aria-label="Default select example"
            onChange={(e) => setSortOption(e.target.value)}
        >
        
            <option>Ordernar</option>
            <option value="price_1">Ascendente</option>
            <option value="price_-1">Descendente</option>
            <option value="rating_-1">Calificación</option>
            <option value="name_1">A - Z</option>
            <option value="name_-1">Z - A</option>
        
        </Form.Select>
    );
};

export default SortOptionsComponent;
