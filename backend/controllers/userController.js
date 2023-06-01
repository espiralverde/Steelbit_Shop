const User = require ("../models/UserModel")
const Review = require ("../models/ReviewModel")
const Product = require ("../models/ProductModel")
const { hashPassword, comparePasswords } = require ("../utils/hashPassword")
const generateAuthToken = require("../utils/generateAuthToken")


const getUsers = async (req, res, next) => {
    try{
        const users = await User.find({}).select("-password")
        return res.json(users)
    }catch (err){
        next (err)
    }
}

const registerUser = async (req, res, next) => {
    try{
        const {name, lastName, email, password} = req.body
        if (!(name && lastName && email && password)) {
            return res.status(400).send("Todos los campos son requeridos")
        }
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).send("El usuario ya existe")
        }
        else {
            const hashedPassword = hashPassword(password)
            const user = await User.create ({
                name,
                lastName, 
                email: email.toLowerCase(),
                password: hashedPassword
            })
            res
            .cookie ("access_token", generateAuthToken(user._id, user.name, user.lastName, user.email, user.isAdmin), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            })
            .status(201)
            .json({
                success: "Usuario creado",
                userCreated: {
                    _id: user._id,
                    name: user.name,
                    lastName: user.lastName,
                    email: user.email,
                    isAdmin: user.isAdmin,
                },
            })
        }

    }catch (err){
        next (err)
    }
}

const loginUser = async (req, res, next) => {
    try{
        const {email, password, doNotLogout} = req.body
        if (!(email && password)) {
            return res.status(400).send("Todos los campos son requeridos")
        }
        const user = await User.findOne({ email }).orFail()
        if(user && comparePasswords(password, user.password)){
            let cookieParams = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            }
            if (doNotLogout) {
                cookieParams = {...cookieParams, maxAge: 1000 * 60 * 60 * 24 * 7}
            }
            return res.cookie(
            "access_token", 
            generateAuthToken(
                    user._id, 
                    user.name, 
                    user.lastName, 
                    user.email, 
                    user.isAdmin
                ),
                cookieParams
                ).json ({
                    success: "Usuario logueado",
                    userLoggedIn : {
                        _id: user._id,
                        name: user.name, 
                        lastName: user.lastName, 
                        email: user.email, 
                        isAdmin: user.isAdmin, 
                        doNotLogout,
                    },
                })
        }
        else{
            return res.status(401).send("Credenciales incorrectas")
        }
    } catch (err){
        next (err)
    }
}

const updateUserProfile = async (req, res, next) => {
    try{
        const user = await User.findById(req.user._id).orFail()
        user.name = req.body.name || user.name
        user.lastName = req.body.lastName || user.lastName
        //user.email = req.body.email || user.email NO la necesito porque el email no se puede cambiar desde el perfil de usuario
        user.phoneNumber = req.body.phoneNumber
        user.address = req.body.address
        user.country = req.body.country
        user.zipCode = req.body.zipCode
        user.city = req.body.city
        user.state = req.body.state

        if (req.body.password !== user.password) {
            user.password = hashPassword(req.body.password)
        }
        await user.save()

        res.json({
            success: "Información de Usuario actualizada",
            userUpdated: {
                _id: user._id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
            },
        })
    } catch (err){
        next (err)
    }
}

const getUserProfile = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id).orFail()
        return res.send(user)
    }catch (err){
        next(err)
    }
}

const writeReview = async (req, res, next) => {
    try{
        //creo la "transaction" para asegurar que el review y la actualización del producto sean OK o NO OK las dos. No puede ocurrir una sin la otra.

        const session = await Review.startSession()

        //get comment, rating from request.bod
        const {comment, rating} = req.body

        //validar pedido:
        if (!(comment && rating)) {
            return res.status(400).send("Todos los campos son requeridos")
        }

        //crear un review id de manera manual
        const ObjectId = require("mongodb").ObjectId
        let reviewId = ObjectId()

        session.startTransaction() //acá empiezo la transaction con la primer operación en la base de datos
        await Review.create ([
            {
                _id: reviewId,
                comment: comment,
                rating: Number(rating),
                user: {_id: req.user._id, name: req.user.name + "" + req.user.lastName},
            }
        ], {session: session})
        
        const product = await Product.findById(req.params.productId).populate("reviews").session(session)
        
        const alreadyReviewed = product.reviews.find((r) => r.user._id.toString() === req.user._id.toString())
        if (alreadyReviewed) {
            await session.abortTransaction()
            session.endSession()
            return res.status(400).send("Review de producto ya realizada")
        }

        // Esto lo uso para calular el rating. Para ello tengo que calcular el total de todos los ratings que haya, y sacar un promedio (más abajo)
        let prc = [...product.reviews]
        prc.push({rating: rating})
        product.reviews.push(reviewId)

        if (product.reviews.length === 1) {
            product.rating = Number(rating);
            product.reviewsNumber = 1;
        }
        else{
            product.reviewsNumber = product.reviews.length
            //PARA SACAR EL PROMEDIO DEL RATING
            let ratingCalc = prc.map((item) => Number(item.rating)).reduce((sum, item) => sum + item, 0) / product.reviews.length
            product.rating = Math.round(ratingCalc)
        }
        await product.save()
        await session.commitTransaction()
        session.endSession()
        res.send("Review creada")

    }catch (err){
        await session.abortTransaction()
        next(err)
    }
}

const getUser = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id).select("name lastName email isAdmin").orFail()
        return res.send(user)
    }catch (err){
        next(err)
    }
}

const updateUser = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id).orFail()
        user.name = req.body.name || user.name
        user.lastName = req.body.lastName || user.lastName
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin

        await user.save()
        res.send("Usuario actualizado")

    }catch (err){
        next(err)
    }
}

const deleteUser = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id).orFail()
        await user.remove()
        res.send("Usuario borrado")
    }catch (err){
        next(err)
    }
}


module.exports = {getUsers, registerUser, loginUser, updateUserProfile, getUserProfile, writeReview, getUser, updateUser, deleteUser}