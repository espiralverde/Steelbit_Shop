// archivo responsable de hacer los queries en los "collection" (tablas en sql) de mongdb
//acá es donde pongo todos los campos que quiere que tengan mis productos (dentro del productSchema)

const mongoose = require("mongoose")
const Review = require ("./ReviewModel")
const imageSchema = mongoose.Schema({
    path: {type: String, required: true}
})



const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    count: { //campo de stock
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number
    },
    reviewsNumber: {
        type: Number,
    },
    sales: {
        type: Number,
        default: 0
    },
    attrs: [ //estos son todos los atributos que puse en la página "product-list"
        {key: {type: String}, value: {type: String}}
        //[{key: "color", value: "red" }, {key: "size", value: "1 TB"}]
    ], 
    images: [imageSchema],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: Review,
        }
    ],
    
}, {
    timestamps: true, //esto me genera un timestamp directamente en MongoDB
})

const Product = mongoose.model("Product", productSchema)
productSchema.index({name: "text", description: "text"}, {name: "TextIndex"}) //con esto el buscador de la página hace las búsquedas de los productos POR LOR NOMBRES "compound Index"
productSchema.index({"attrs.key": 1, "attrs.value": 1}) //este índice busca por las propiedades. Con -1 busca en forma descendente

module.exports = Product