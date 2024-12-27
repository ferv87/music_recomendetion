let express = require('express');
let mongoose = require('mongoose');
let cors = require("cors")
let cancionesRouter = require('./view/cancionesRoutes');

let app = express();
let port = 3000;

async function connectDB() {
    try{
        await mongoose.connect('mongodb://localhost:27017/musica',{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
    }catch(error){
        console.error(error);
        process.exit(1);
    }
    
}

let corsOptions = {
    origin : 'http://127.0.0.1:5550',
    optionSuccessStatus: 200
}

connectDB();

app.use(cors(corsOptions))

app.use(express.json());

app.use('/canciones', cancionesRouter);

app.listen(port,()=>{
    console.log("Servidor corriendo en el puerto "+port);
})