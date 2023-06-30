import { Row, Col, Container, Form, Button, CloseButton, Table, Alert} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom"
import React, { useRef, useState } from "react"
import { changeCategory, setValuesForAttrFromDbSelectForm, setAttributesTableWrapper } from "./utils/utils";

const CreateProductPageComponent = ({
        createProductApiRequest, 
        uploadImagesApiRequest, 
        uploadImagesCloudinaryApiRequest, 
        categories,
        reduxDispatch, 
        newCategory, 
        deleteCategory,
        saveAttributeToCatDoc
    }) => {

    const [validated, setValidated] = useState(false);
    const [attributesTable, setAttributesTable] = useState([])
    const [attributesFromDb, setAttributesFromDb] = useState([])
    const [images, setImages] = useState(false)
    const [isCreating, setIsCreating] = useState("")
    const [createProductResponseState, setCreateProductResponseState] = useState({message: "", error: ""})
    const [categoryChoosen, setCategoryChoosen] = useState("Elija la categoría")
    const [newAttrKey, setNewAttrKey] = useState(false)
    const [newAttrValue, setNewAttrValue] = useState(false)

    const attrVal = useRef(null)
    const attrKey = useRef(null)
    const createNewAttrKey = useRef(null)
    const createNewAttrVal = useRef(null)

    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget.elements;

        
        const formInputs = {
            name: form.name.value,
            description: form.description.value,
            count: form.count.value,
            price: form.price.value,
            category: form.category.value,
            attributesTable : attributesTable,
        }
        if (event.currentTarget.checkValidity() === true) {
            if (images.length > 3) {
                setIsCreating("Máximo 3 fotos")
                return
            }
            createProductApiRequest(formInputs)
            .then(data => {
                if (images) {
                    if (process.env.NODE_ENV !== "production") { //to do: change to !==
                        uploadImagesApiRequest(images, data.productId)
                        .then(res => {})
                        .catch((er) => setIsCreating(er.response.data.message ? er.response.data.message : er.response.data))
                    } else {
                        uploadImagesCloudinaryApiRequest(images, data.productId)
                    }
                }
                if (data.message === "Producto creado") navigate("/admin/products")
            })
            .catch(er => {
                setCreateProductResponseState({error: er.response.data.message ? er.response.data.message : er.response.data})
            })
    }
        setValidated(true);
    };

    const uploadHandler = (images) => {
        setImages(images)
    }

    const newCategoryHandler = (e) => {
        if (e.keyCode && e.keyCode === 13 && e.target.value) {
            reduxDispatch(newCategory(e.target.value))
            setTimeout(() => {
                let element = document.getElementById("cats")
                setCategoryChoosen(e.target.value)
                element.value = e.target.value
                e.target.value = ""
            }, 500)
        }
    }

    const deleteCategoryHandler = () => {
        let element = document.getElementById("cats")
        reduxDispatch(deleteCategory(element.value))
        setCategoryChoosen("Elija la categoría")
    }

    const attributeValueSelected = (e) => {
        if (e.target.value !== "Elija la categoría") {
            setAttributesTableWrapper(attrKey.current.value, e.target.value, setAttributesTable)
        }
    }

    const deleteAttribute = (key) => {
        setAttributesTable((table) => table.filter((item) => item.key !== key))
    }

    const newAttrKeyHandler = (e) => {
        e.preventDefault()
        setNewAttrKey(e.target.value)
        addNewAttributeManually(e)
    }

    const newAttrValueHandler = (e) => {
        e.preventDefault()
        setNewAttrValue(e.target.value)
        addNewAttributeManually(e)
    }

    const addNewAttributeManually = (e) => {
        
        if (e.keyCode && e.keyCode === 13) {
            if (newAttrKey && newAttrValue) {
                reduxDispatch(saveAttributeToCatDoc(newAttrKey, newAttrValue, categoryChoosen))
                setAttributesTableWrapper(newAttrKey, newAttrValue, setAttributesTable)
                e.target.value = ""
                createNewAttrKey.current.value = ""
                createNewAttrVal.current.value = ""
                setNewAttrKey(false)
                setNewAttrValue(false)
            }
        }
    }

    const checkKeyDown = (e) => {
        if (e.code === "Enter")e.preventDefault()
    }

    return (
        <Container>
            <Row className="mt-5 justify-content-md-center">
                <Col md={1}>
                    <Link to="/admin/products" className="btn btn-primary my-3">Volver</Link>
                </Col>
                
                <Col md={6}>
                    <h1>Agregar nuevo producto</h1>
                    <Form noValidate validated={validated} onSubmit={handleSubmit} onKeyDown={(e) => checkKeyDown(e)}>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" name="name" required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="example.FormControlTextarea1">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control type="text" name="description" required as="textarea" rows={3} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCount">
                                <Form.Label>Cantidad/Stock</Form.Label>
                                <Form.Control type="number" name="count" required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPrice">
                                <Form.Label>Precio</Form.Label>
                                <Form.Control type="text" step="0.01" min="0" max="10" name="price" required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCategory">
                                <Form.Label>
                                    Categoría
                                    <CloseButton onClick={deleteCategoryHandler} /> (<small>Quitar Categoría seleccionada</small>)
                                </Form.Label>
                                <Form.Select
                                    id="cats"
                                    required
                                    name="category"
                                    aria-label="Default select example"
                                    onChange={(e) => changeCategory(e, categories, setAttributesFromDb, setCategoryChoosen)}
                                >
                                    <option value="">Elija la categoría</option>
                                    {categories.map((category, idx) => (
                                        <option key={idx} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}

                                </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicNewCategory">
                                <Form.Label>Agregar nueva Categoría {" "}</Form.Label>
                                <Form.Control onKeyUp={newCategoryHandler} name="newCategory" type="text" />
                        </Form.Group>

                        {attributesFromDb.length > 0 && (

                            <Row className="mt-5">
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formBasicAttributes">
                                        <Form.Label>Elegir atributo y valor</Form.Label>
                                        <Form.Select
                                            name="atrrKey"
                                            aria-label="Default select example"
                                            ref={attrKey}
                                            onChange={(e) => setValuesForAttrFromDbSelectForm(e, attrVal, attributesFromDb)}
                                        >
                                            <option>Elegir Atributo</option>
                                            {attributesFromDb.map((item, idx) => (
                                                <React.Fragment key={idx}>
                                                    <option value={item.key}>{item.key}</option>
                                                </React.Fragment>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formBasicAttributeValue">
                                    <Form.Label>Elegir Valor del Atributo</Form.Label>
                                        <Form.Select
                                            onChange={attributeValueSelected}
                                            name="atrrVal"
                                            aria-label="Default select example"
                                            ref={attrVal}
                                        >
                                            <option>Elegir Valor</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                        )}


                        <Row>
                            {attributesTable.length > 0 && (
                                <Table hover>
                                    <thead>
                                        <tr>
                                            <th>Atributo</th>
                                            <th>Valor</th>
                                            <th>Borrar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attributesTable.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>{item.key}</td>
                                                <td>{item.value}</td>
                                                <td>
                                                    <CloseButton onClick={() => deleteAttribute(item.key)} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Row>


                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formBasicNewAttributeValue">
                                    <Form.Label>Agregar nuevo Atributo</Form.Label>
                                    <Form.Control
                                        ref={createNewAttrKey}
                                        disabled={["", "Elija la categoría"].includes(categoryChoosen)}
                                        placeholder="Primero elegir o agregar Categoría"
                                        name="newAttrValue"
                                        type="text"
                                        onKeyUp={newAttrKeyHandler}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formBasicNewAttribute">
                                    <Form.Label>Agregar nuevo Valor</Form.Label>
                                    <Form.Control
                                        ref={createNewAttrVal}
                                        disabled={["", "Elija la categoría"].includes(categoryChoosen)}
                                        placeholder="Primero elegir o agregar Categoría"
                                        required={newAttrKey}
                                        name="newAttrValue"
                                        type="text"
                                        onKeyUp={newAttrValueHandler}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Alert show={newAttrKey && newAttrValue} variant="primary">
                            Presione "Enter" para guardar los cambios
                        </Alert>

                        <Form.Group className="mb-3" controlId="formFileMultiple">
                                <Form.Label>Imágenes</Form.Label>
                                <Form.Control type="file" required multiple onChange={(e) => uploadHandler(e.target.files)} />
                                {isCreating}
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Agregar
                        </Button>
                        {createProductResponseState.error ?? ""}
                    </Form>
                </Col>
            </Row>

        </Container>
    )
}

export default CreateProductPageComponent