import { Row, Col, Container, ListGroup, Button } from "react-bootstrap";
import PaginationComponent from "../../components/PaginationComponent";
import ProductForListComponent from "../../components/ProductForListComponent";
import SortOptionsComponent from "../../components/SortOptionsComponent";
import PriceFilterComponent from "../../components/filterQueryResultOptions/PriceFilterComponent";
import RatingFilterComponent from "../../components/filterQueryResultOptions/RatingFilterComponent";
import CategoryFilterComponent from "../../components/filterQueryResultOptions/CategoryFilterComponent";
import AttributesFilterComponent from "../../components/filterQueryResultOptions/AttributesFilterComponent";
import { useEffect, useState } from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom"


const ProductListPageComponent = ({getProducts, categories}) => {

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [attrsFilter, setAttrsFilter] = useState([]) // trae los atributos de la categoría desde MongDB y los muestra en la página
    const [attrsFromFilter, setAttrsFromFilter] = useState([]) //con esto traigo los user filters por categoría
    const [showResetFiltersButton, setShowResetFiltersButton] = useState(false)
    const [filters, setFilters] = useState({}) //con esto busco todos los filtros
    const [price, setPrice] = useState(15000) // con esto le digo al filtro donde debe estar al inicio
    const [ratingsFromFilter, setRatingsFromFilter] = useState({})
    const [categoriesFromFilter, setCategoriesFromFilter] = useState ({})
    const [sortOption, setSortOption] = useState("")
    const [paginationLinksNumber, setPaginationLinksNumber] = useState(null)
    const [pageNum, setPageNum] = useState(null)



    const {categoryName} = useParams() || ""
    const {pageNumParam} = useParams() || 1 //esta es el nro de página por defecto donde se van a mostrar los prods.
    const {searchQuery} = useParams() || ""

    const location  = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (categoryName) {
            let categoryAllData = categories.find((item) => item.name === categoryName.replaceAll(",", "/"))
            if (categoryAllData) {
                let mainCategory = categoryAllData.name.split("/")[0]
                let index = categories.findIndex((item) => item.name === mainCategory)
                setAttrsFilter(categories[index].attrs)
            }
        } else {
            setAttrsFilter([])
        }
    }, [categoryName, categories])

    useEffect (() => {
        if (Object.entries(categoriesFromFilter).length > 0) {
            setAttrsFilter([])
            var cat = []
            var count
            Object.entries(categoriesFromFilter).forEach(([category, checked]) => {
                if (checked) {
                    var name = category.split("/")[0]
                    cat.push(name)
                    count = cat.filter((x) => x === name).length
                    if (count === 1 ){
                        var index = categories.findIndex((item) => item.name === name)
                        setAttrsFilter((attrs) => [...attrs, ...categories[index].attrs])
                    }
                }
            })
        }
    }, [categoriesFromFilter, categories])

    useEffect (() => {
        getProducts(categoryName, pageNumParam, searchQuery, filters, sortOption)
        .then(products => {
            setProducts(products.products)
            setPaginationLinksNumber(products.paginationLinksNumber)
            setPageNum(products.pageNum)
            setLoading(false)
        })
        .catch((er) => {
            console.log(er)
            setError(true)
        })
    }, [categoryName, pageNumParam, searchQuery, filters, sortOption])

    const handleFilters = () => {
        navigate(location.pathname.replace(/\/[0-9]+$/, ""))
        setShowResetFiltersButton(true)
        setFilters({
            price: price,
            rating: ratingsFromFilter,
            category: categoriesFromFilter,
            attrs : attrsFromFilter,
        })
    }
    const resetFilters = () => {
        setShowResetFiltersButton(false)
        setFilters({})
        window.location.href = "/product-list"
    }

    return (
            <Container fluid>
                <Row>
                    <Col md={3}>
                        <ListGroup variant="flush">
                            <ListGroup.Item className="mb-3 mt-3">
                                <SortOptionsComponent setSortOption={setSortOption}/>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                FILTRAR: <br />
                                <PriceFilterComponent price={price} setPrice={setPrice} />
                            </ListGroup.Item>
                            <ListGroup.Item><RatingFilterComponent setRatingsFromFilter={setRatingsFromFilter} /></ListGroup.Item>
                            
                            {/* Este List group es el que muestra las categorias en las páginas de product-list . De esta forma le digo que lo muestre solo si no aparece "category" en la dirección*/}
                            {!location.pathname.match(/\/category/) && (
                                <ListGroup.Item>
                                    <CategoryFilterComponent setCategoriesFromFilter={setCategoriesFromFilter} />
                                </ListGroup.Item>
                            )}
                            
                            <ListGroup.Item>
                                <AttributesFilterComponent attrsFilter={attrsFilter} setAttrsFromFilter={setAttrsFromFilter}/>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button onClick={handleFilters} variant="primary">Filtrar</Button>{" "}
                                {showResetFiltersButton && (
                                    <Button onClick={resetFilters} variant="danger">Limpiar Filtro</Button>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={9}>
                        {loading ? (
                            <h1>Cargando productos...</h1>
                        ) : error ? (
                            <h1>Error al cargar los productos. Intente nuevamente más tarde</h1>
                        ) : (
                            products.map((product) => (
                                <ProductForListComponent
                                    key={product._id}
                                    images={product.images}
                                    name={product.name}
                                    description={product.description}
                                    price={product.price}
                                    rating={product.rating}
                                    reviewsNumber={product.reviewsNumber}
                                    productId={product._id}
                                />
                            ))
                        )}

                        {paginationLinksNumber > 1 ? (
                            <PaginationComponent 
                                categoryName={categoryName} 
                                searchQuery={searchQuery} 
                                paginationLinksNumber={paginationLinksNumber} 
                                pageNum={pageNum}/>
                        ) : null}

                    </Col>
                </Row>
            </Container>
        );
    };

export default ProductListPageComponent;

