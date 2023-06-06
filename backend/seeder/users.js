const bcrypt = require("bcryptjs")
const ObjectId = require("mongodb").ObjectId

const users = [
    {
    name: 'admin',
    lastName: 'admin',
    email: 'admin@admin.com',
    password: bcrypt.hashSync('admin@admin.com', 10),
    isAdmin: true,
},
{
    _id: ObjectId("625add3d78fb449f9d9fe2ee"),
    name: 'Usuario',
    lastName: 'Regular',
    email: 'usuario@regular.com',
    password: bcrypt.hashSync('usuario@regular.com', 10),
},
{
    _id: ObjectId("647e4508f2801d19fdaa085f"),
    name: 'Micaela',
    lastName: 'Liborio',
    email: 'micaelaliborio28@gmail.com',
    password: bcrypt.hashSync('micaelaliborio28@gmail.com', 10),
    address: 'Duarte Quirós 2055',
    phoneNumber: 3516153745,
    country: 'Argentina',
    state: 'Córdoba',
    zipCode: 5000,
},

]

module.exports = users
