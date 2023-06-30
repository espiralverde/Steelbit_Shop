import { Row, Col, Container, Form, Button, CloseButton, Table, Alert, Image} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom"
import { Fragment, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom";
import { uploadImagesCloudinaryApiRequest } from "../utils/utils";
import { changeCategory, setValuesForAttrFromDbSelectForm, setAttributesTableWrapper } from "./utils/utils";


const onHover = {
    cursor: "pointer",
    position: "absolute",
    left: "5px",
    top: "-10px",
    transform: "scale(2.5)"
}

const EditProductPageComponent = ({
        categories, 
        fetchProduct, 
        updateProductApiRequest, 
        reduxDispatch, 
        saveAttributeToCatDoc, 
        imageDeleteHandler,
        uploadHandler,
        uploadImagesApiRequest,
        uploadImagesCloudinaryApiRequest
        
    }) => {
        const [validated, setValidated] = useState(false);
        const [product, setProduct] = useState({})
        const [updateProductResponseState, setUpdateProductResponseState] = useState({message:"", error: ""})
        const [attributesFromDb, setAttributesFromDb] = useState([]) //esto es para la lista de selección de las categorías
        const [attributesTable, setAttributesTable] = useState([]) //esto es para la tabla html en la página de edit-product
        const [categoryChoosen, setCategoryChoosen] = useState("Elija la categoría")
        const [newAttrKey, setNewAttrKey] = useState(false)
        const [newAttrValue, setNewAttrValue] = useState(false)
        const [imageRemoved, setImageRemoved] = useState(false)
        const [isUploading, setIsUploading] = useState("")
        const [imageUploaded, setImageUploaded] = useState(false)

        const attrVal = useRef(null)
        const attrKey = useRef(null)
        const createNewAttrKey = useRef(null)
        const createNewAttrVal = useRef(null)

    const {id} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        fetchProduct(id)
        .then((product) => setProduct(product))
        .catch((er) => console.log(er))
    }, [id, imageRemoved, imageUploaded])


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
            updateProductApiRequest(id, formInputs)
            .then(data => {
                if (data.message === "Producto actualizado") navigate("/admin/products")
            })
            .catch((er) => 
                setUpdateProductResponseState({error: " Error en la carga. Por favor, compruebe los datos ingresados."}))
                //setUpdateProductResponseState({error: er.response.data.message ? er.response.data.message : er.response.data}))
    }
        setValidated(true);
    };

    useEffect(() => {
        let categoryOfEditedProduct = categories.find((item) => item.name === product.category)
        if (categoryOfEditedProduct) {
            const mainCategoryOfEditedProduct = categoryOfEditedProduct.name.split("/")[0]
            const mainCategoryOfEditedProductAllData = categories.find((categoryOfEditedProduct) => categoryOfEditedProduct.name === mainCategoryOfEditedProduct)
            
        if (mainCategoryOfEditedProductAllData && mainCategoryOfEditedProductAllData.attrs.length > 0) {
            setAttributesFromDb(mainCategoryOfEditedProductAllData.attrs)
            }
        }
        setCategoryChoosen(product.category)
        setAttributesTable(product.attrs)
    }, [product])

    const attributeValueSelected = (e) => {
        if (e.target.value !== "Elegir Valor") {
            setAttributesTableWrapper(attrKey.current.value, e.target.value, setAttributesTable)
        }
    }

    const deleteAttribute = (key) => {
        setAttributesTable((table) => table.filter((item) => item.key !== key))
    }

    const checkKeyDown = (e) => {
        if (e.code === "Enter") e.preventDefault()
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

    return (
        <Container>
            <Row className="mt-5 justify-content-md-center">
                <Col md={1}>
                    <Link to="/admin/products" className="btn btn-primary my-3">Volver</Link>
                </Col>
                
                <Col md={6}>
                    <h1>Editar Producto</h1>
                    <Form noValidate validated={validated} onSubmit={handleSubmit} onKeyDown={(e) => checkKeyDown(e)}>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" name="name" defaultValue={product.name} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="example.FormControlTextarea1">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control type="text" name="description" required as="textarea" rows={3} defaultValue={product.description} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCount">
                                <Form.Label>Cantidad/Stock</Form.Label>
                                <Form.Control type="number" name="count" required defaultValue={product.count}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPrice">
                                <Form.Label>Precio</Form.Label>
                                <Form.Control type="text" name="price" required defaultValue={product.price} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCategory">
                                <Form.Label>Categoría</Form.Label>
                                <Form.Select
                                    required
                                    name="category"
                                    aria-label="Default select example"
                                    //onChange={changeCategory} lo cambio, porque ahora traigo todo desde el utils.js
                                    onChange={(e) => changeCategory(e, categories, setAttributesFromDb, setCategoryChoosen)}
                                >
                                    <option value="Elija la categoría">Elija la categoría</option>
                                    {categories.map((category, idx) => {
                                        return product.category === category.name ? (
                                            <option selected key={idx} value={category.name}>
                                                {category.name}
                                            </option>
                                        ) : (
                                            <option key={idx} value={category.name}>
                                            {category.name}
                                            </option>
                                        )
                                    })}
                                </Form.Select>
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
                                            //onChange={setValuesForAttrFromDbSelectForm} //la cambio porque ahora viene de utils.js
                                            onChange={(e) => setValuesForAttrFromDbSelectForm(e, attrVal, attributesFromDb)} 
                                        >
                                            <option>Elegir Atributo</option>
                                                {attributesFromDb.map((item, idx) => (
                                                    <Fragment key={idx}>
                                                        <option value={item.key}>{item.key}</option>
                                                    </Fragment>
                                                ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formBasicAttributeValue">
                                    <Form.Label>Elegir Valor del Atributo</Form.Label>
                                        <Form.Select
                                            name="atrrVal"
                                            aria-label="Default select example"
                                            ref={attrVal}
                                            onChange={attributeValueSelected}
                                        >
                                            <option>Elegir Valor</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        )}

                        <Row>
                            {attributesTable && attributesTable.length > 0 && (
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
                                        disabled={categoryChoosen === "Elija la categoría"}
                                        placeholder="Primero elegir o agregar Categoría"
                                        name="newAttrKey"
                                        type="text"
                                        onKeyUp={newAttrKeyHandler}
                                        required={newAttrValue}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formBasicNewAttribute">
                                    <Form.Label>Agregar nuevo Valor</Form.Label>
                                    <Form.Control
                                        ref={createNewAttrVal}
                                        disabled={categoryChoosen === "Elija la categoría"}
                                        placeholder="Primero elegir o agregar Categoría"
                                        name="newAttrValue"
                                        type="text"
                                        onKeyUp={newAttrValueHandler}
                                        required={newAttrKey}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Alert show={newAttrKey && newAttrValue} variant="primary">
                            Presione "Enter" para guardar los cambios
                        </Alert>

                        <Form.Group className="mb-3" controlId="formFileMultiple">
                                <Form.Label>Imágenes</Form.Label>
                                <Row>
                                    {product.images && product.images.map((image, idx) => (
                                        <Col key={idx} style={{position: "relative"}} xs={3}>
                                            <Image crossOrigin="anonymous" src={image.path ?? null} fluid />
                                            <i style={onHover} onClick={() => imageDeleteHandler(image.path, id).then(data => setImageRemoved(!imageRemoved))} className=" bi bi-x text-danger "></i>
                                        </Col>
                                    ))}
                                </Row>
                                {/* el form control le saco el "required", para que no sea obligatorio subir una imagen 
                                <Form.Control required type="file" multiple onChange={e => {setIsUploading("Subiendo archivo...")*/}
                                <Form.Control type="file" multiple onChange={e => {setIsUploading("Subiendo archivo...")
                                if (process.env.NODE_ENV !== "production") {
                                    //to do: change to !==
                                    uploadImagesApiRequest(e.target.files, id)
                                    .then(data => {
                                        setIsUploading("Archivo subido")
                                        setImageUploaded(!imageUploaded)
                                    })
                                    .catch((er) => setIsUploading(er.response.data.message ? er.response.data.message : er.response.data))
                                } else {
                                    uploadImagesCloudinaryApiRequest(e.target.files, id)
                                    setIsUploading("Archivos subidos. Quizás necesite refrescar la pantalla")
                                    setTimeout(() => {
                                        setImageUploaded(!imageUploaded)
                                    }, 5000)
                                }

                                }} />
                                {isUploading}
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Actualizar
                        </Button>
                        {updateProductResponseState.error ?? ""}
                    </Form>
                </Col>
            </Row>

        </Container>
    )
}
export default EditProductPageComponent;