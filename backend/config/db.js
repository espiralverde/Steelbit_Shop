require ("dotenv").config();
const mongoose = require("mongoose")

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true, // los 2 campos son para que no pasen mensajes de mongo si algo fue deprecado. No son importantes/vitales. Pueden no estar.
        })
        console.log("***************** CONECTADO a MongoDB *****************");

    } catch (error) {
        console.log("No se pudo conectar con la base de datos");
        process.exit(1);
    }
}
module.exports = connectDB