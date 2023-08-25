const mongoose = require("mongoose")

const categorySchema = mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, default: "Categoria por default"},
    image: {type: String, default: "/images/carousel_1.jpg"},
    attrs: [{key: {type: String}, value: [{type: String}] }],
})
categorySchema.index({description: 1})
const Category = mongoose.model("Category", categorySchema)
module.exports = Category