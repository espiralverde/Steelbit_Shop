const Product = require("../models/ProductModel")
const recordsPerPage = require("../config/pagination")
const imageValidate = require("../utils/imageValidate")
const ObjectId = require("mongodb").ObjectId


const getProducts = async (req, res, next) => {
    try{
        let query = {}
        let queryCondition = false;

        let priceQueryCondition = {}
        if (req.query.price) {
            queryCondition = true
            priceQueryCondition = { price: {$lte: Number(req.query.price) } } //$lte es comando de mongoDB
        }
        let ratingQueryCondition = {}
        if (req.query.rating) {
            queryCondition = true
            ratingQueryCondition = { rating: {$in: req.query.rating.split(",") } } //$in es comando de mongoDB
        }
        
        let categoryQueryCondition = {}
        const categoryName = req.params.categoryName || ""
        
        if (categoryName){
            queryCondition = true
            //let a = categoryName.replaceAll("," , "/") ORIGINAL
            //Cambio este valor para que funcione en Render.com
            let a = categoryName.replace(/, /g , "/")
            var regEx = new RegExp("^" +a)
            categoryQueryCondition = {category: regEx}
        }

        if (req.query.category) {
            queryCondition = true
            let a = req.query.category.split(",").map((item) => {
                if (item) return new RegExp ("^" + item)
            })
            
            categoryQueryCondition = {
                category: { $in: a } 
            }
        }

        let attrsQueryCondition = []
        if (req.query.attrs){
            attrsQueryCondition = req.query.attrs.split(",").reduce((acc, item) =>{
                if (item) {
                    let a = item.split("-")
                    let values = [...a]
                    values.shift() //acá saca la key, es decir el primer valor
                    let a1 = {
                        attrs: { $elemMatch: { key: a[0], value: { $in: values }}}
                    }
                    acc.push(a1)
                    return acc
                } else return acc
            }, [])
            queryCondition = true
        }

        //paginación
        const pageNum = Number(req.query.pageNum) || 1 

        //opciones para acomodar por nombre, producto, etc
        
        let sort = {}
        const sortOption = req.query.sort || ""
        if (sortOption){
            let sortOpt = sortOption.split("_")
            sort = { [sortOpt[0]]: Number(sortOpt[1]) }
        }

        const searchQuery = req.params.searchQuery || ""
        let searchQueryCondition = {}
        let select = {}
        if (searchQuery){
            queryCondition = true
            searchQueryCondition = {$text: { $search: searchQuery }}
            select = {
                score: { $meta: "textScore"}
            }
        sort = { score: {$meta: "textScore" } } //con esto acomodo para que me traiga los resultados MÁS correctos primero, según la búsqueda que haga
        }

        if (queryCondition){
            query = {
                $and: [ priceQueryCondition,
                        ratingQueryCondition,
                        categoryQueryCondition,
                        searchQueryCondition,
                        ...attrsQueryCondition ] //esto es para que me traiga la condición de precio Y rating a la vez.
        }

        }
        
        const totalProducts = await Product.countDocuments(query)
        const products = await Product.find(query)
        .select(select)
        .skip(recordsPerPage * (pageNum - 1)) //con esto calculo cuantos productos muestro por página, una vez que me muevo a páginas mas altas , y así no repetir productos anteriores
        .sort(sort)
        .limit(recordsPerPage) //limit pone tope a cuantos productos me muestra por búsqueda
        res.json({products, pageNum, paginationLinksNumber : Math.ceil(totalProducts / recordsPerPage),
    })
    }catch(err){ 
        next(err)
    }
}
const getProductById = async (req, res, next) => {
    try{
        const product = await Product.findById(req.params.id).populate("reviews").orFail() //populate es el método de Mongo que me va a traer todas las reviews de un producto en particular, cuando haga la búsqueda.
        res.json(product)

    }catch(err){
        next(err)
    }
}

const getBestsellers = async (req, res, next) => { //con esto acomodo (muestra) los productos con mayor cantidad de ventas, usando comandos de MongoDB específicos
    try{
        const products = await Product.aggregate([
            { $sort: { category: 1, sales: -1 } },
            { $group: { _id: "$category", doc_with_max_sales: { $first: "$$ROOT" } } }, 
            { $replaceWith: "$doc_with_max_sales" },
            { $match: {sales: { $gt: 0 } } },
            { $project: {_id:1, name: 1, images: 1, category: 1, description: 1 } },
            { $limit: 3}
        ])
        res.json(products)

    }catch(err){
        next(err)
    }
}

const adminGetProducts = async (req, res, next) =>{
    try{
        const products = await Product.find({})
        .sort({category: 1})
        .select('name price category')
        return res.json(products)
    }catch(err){
        next(err)
    }
}

const adminDeleteProduct = async (req, res, next) =>{
    try{
        const product = await Product.findById(req.params.id).orFail()
        await product.remove()
        res.json({ message: "Producto Borrado"})
    }catch(err){
        next(err)
    }
}


const adminCreateProduct = async (req, res, next) =>{
    try{
        const product = new Product()
        const { name, description, count, price, category, attributesTable } = req.body;
        product.name = name;
        product.description = description;
        product.count = count;
        product.price = price;
        product.category = category;
        if (attributesTable.length > 0){
            attributesTable.map((item) => {
                product.attrs.push(item)
            })
        }
        await product.save()
        res.json({
            message: "Producto creado",
            productId: product._id
        })
    }catch(err){
        next(err)
    }
}

const adminUpdateProduct = async (req, res, next) =>{
    try{
        const product = await Product.findById(req.params.id).orFail()
        const { name, description, count, price, category, attributesTable } = req.body
        product.name = name || product.name
        product.description = description || product.description
        product.count = count || product.count
        product.price = price || product.price
        product.category = category || product.category
        if ( attributesTable > 0 ) {
            product.attrs = []
            attributesTable.map ((item) => {
                product.attrs.push(item)
            })
        } else{
            product.attrs = []
        }
        await product.save()
        res.json ({
            message: "Producto actualizado"
        })
    }catch(err){
        next(err)
    }
}
const adminUpload = async (req, res, next) =>{
    if (req.query.cloudinary === "true") {
        try{
            let product = await Product.findById(req.query.productId).orFail()
            product.images.push({path: req.body.url})
            await product.save()
        } catch (err) {
            next(err)
        }
        return
    }
    try{
        if (!req.files || !!req.files.images === false){
            return res.status(400).send("No hay archivos subidos")
        }
        const validateResult = imageValidate(req.files.images)
        if (validateResult.error) {
            return res.status(400).send(validateResult.error)
        }
            //con esto genero nombres aleatorios para los nombres de las fotos que subo
        const path = require ("path")
        const { v4: uuidv4 } = require ("uuid")
        const uploadDirectory = path.resolve(
            __dirname,
            "../../frontend",
            "public", 
            "images", 
            "products")

        let product = await Product.findById(req.query.productId).orFail()
        let imagesTable = []
        if (Array.isArray(req.files.images)){
            imagesTable = req.files.images
        }
        else{
            imagesTable.push(req.files.images)
        }
        for (let image of imagesTable){
            var fileName = uuidv4() + path.extname(image.name)
            var uploadPath = uploadDirectory + "/" + fileName
            product.images.push({ path: "/images/products/" + fileName })
            image.mv(uploadPath, function(err){
                if (err){
                    return res.status(500).send(err)
                }
            })
            await product.save()
            return res.send("Archivo subido!")
        }
    }catch (err){
        next(err)
    }
}
const adminDeleteProductImage = async (req, res, next) => {
    const imagePath = decodeURIComponent(req.params.imagePath)
    if (req.query.cloudinary === "true") {
        try{
            await Product.findOneAndUpdate({_id: req.params.productId}, {$pull: {images: {path: imagePath}}}).orFail()
            return res.end()
        } catch (er) {
            next(er)
        }
        return // con esto no se ejecuta el código que está abajo, que es para borrar las imágenes LOCALMENTE
    }
    try{
        const path = require ("path")
        const finalPath = path.resolve("../frontend/public") + imagePath
        
        const fs = require("fs")
        fs.unlink(finalPath, (err) => {
            if (err) {
                res.status(500).send(err)
            }
        })
        await Product.findOneAndUpdate(
            {_id: req.params.productId}, 
            {$pull: {images: {path: imagePath}}}
            ).orFail()
        return res.end()
    } catch (err){
        next (err)
    }

}
///////////////////////////////////////////////////////////////
const adminUpdatePriceFromExcel = async (req, res, next) => {
    
    const updates = req.body
    if(ObjectId.isValid(req.params.id)) {
        const product = await Product.findById(req.params.id)
        .orFail()
        .updateOne({_id: req.params.id}, {$set: updates})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: "No se pudo actualizar"})
        })
    } else {
        res.status(500).json({error: "ERROR"})
    }
};
///////////////////////////////////////////////////////////////

module.exports = {getProducts, getProductById, getBestsellers, adminGetProducts, adminDeleteProduct, adminCreateProduct, adminUpdateProduct, adminUpload, adminDeleteProductImage, adminUpdatePriceFromExcel}