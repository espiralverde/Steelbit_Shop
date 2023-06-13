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
    name: 'Martin',
    lastName: 'Sosa',
    email: 'martinsosa@gmail.com',
    password: bcrypt.hashSync('martinsosa@gmail.com', 10),
    phoneNumber: 351123456,
    address: 'Colón 4900',
    country: 'Argentina',
    zipCode: 5000,
    city: 'Córdoba',
    state: 'Córdoba',
    
},
{
    _id: ObjectId("647e4508f2801d19fdaa085f"),
    name: 'Micaela',
    lastName: 'Liborio',
    email: 'micaelaliborio28@gmail.com',
    password: bcrypt.hashSync('micaelaliborio28@gmail.com', 10),
    phoneNumber: 3516153745,
    address: 'Duarte Quirós 2000',
    country: 'Argentina',
    zipCode: 5000,
    city: 'Córdoba',
    state: 'Córdoba',
    
},

]

module.exports = users
