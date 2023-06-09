const Category = require("../models/CategoryModel")


const getCategories = async (req, res, next) => {
    try{
        const categories = await Category.find({}).sort({name: "asc"}).orFail()
        res.json(categories)

    }catch(error){
        next (error)
    }

}

const newCategory = async (req, res, next) => {
    try {
        const {category} = req.body
        if(!category) {
            res.status(400).send("Falta agregar la Categoria")
        }
        const categoryExists = await Category.findOne({name: category})
        if (categoryExists){
            res.status(400).send("Ya existe una Categoría con ese nombre")
        }else{
            const categoryCreated = await Category.create({
                name: category
            })
            res.status(201).send({categoryCreated: categoryCreated})
        }

    }catch(err) {
        next(err)
    }
}

const deleteCategory = async (req, res, next) => {
    //return res.send(req.params.category)
    try{
        if (req.params.category !== "Elija la categoría"){
            const categoryExists = await Category.findOne({
                name: decodeURIComponent(req.params.category)
            }).orFail()
            await categoryExists.remove()
            res.json({categoryDeleted: true})
        }

    }catch(err){
        next(err)
    }
}

const saveAttr = async (req, res, next) => {
    const {key, val, categoryChoosen} = req.body
    if(!key || !val || !categoryChoosen) {
        return res.status(400).send ("Todos los campos son requeridos")
    }
    try{
        const category = categoryChoosen.split ("/")[0]
        const categoryExists = await Category.findOne({name: category}).orFail()

        if (categoryExists.attrs.length > 0){
            let keyDoesNotExistInDatabase = true
            categoryExists.attrs.map((item, idx) => {
                if (item.key === key){
                    keyDoesNotExistInDatabase = false
                    let copuAttributeValues = [...categoryExists.attrs[idx].value]
                        copuAttributeValues.push(val)
                    let newAtrtributeValues = [...new Set(copuAttributeValues)]
                    categoryExists.attrs[idx].value = newAtrtributeValues
                }
            })

            if (keyDoesNotExistInDatabase){
                categoryExists.attrs.push({key: key, value: [val]})
            }

        } else {
            categoryExists.attrs.push({key: key, value:[val]})
        }
        await categoryExists.save()
        let cat = await Category.find({}).sort({name: "asc"})
        return res.status(201).json({categoriesUpdated: cat})
        


    }catch(err){
        next (err)
    }
}


module.exports = {getCategories, newCategory, deleteCategory, saveAttr}

