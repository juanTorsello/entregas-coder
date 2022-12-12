const { json } = require("express");
const express = require("express");
const { Router } = express;
const path = require("path")
const fs = require('fs');

const app  = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json())


/// socket 
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
///

const modulo_Contenedor = require("./class_Contenedor");
const Contenedor = modulo_Contenedor.Contenedor
const fileName = "producto.txt"
const unContenedor = new Contenedor (fileName)

async function inicializar_contenedor(){
    
    await unContenedor.save({title: "auto",price: 100, thumbnail: "link1"/*"https://acroadtrip.blob.core.windows.net/catalogo-imagenes/m/RT_V_12aa5deef3794cc4ad0dfcd88426ef17.jpg"*/})
    await unContenedor.deleteAll()
}

inicializar_contenedor()

const viewFolder = path.join(__dirname,"views")
app.set('views', viewFolder);
app.set('view engine', 'ejs');

const productos = []

// carga la pantalla inicial
app.get('/', (req, res) => {
    let products = unContenedor.getAll().then(products => res.render('form_carga',{products}))
    
});

io.on('connection', socket => {
    console.log('Nuevo cliente conectado!')

    /* Envio los productos al cliente que se conectó */
    socket.emit('productos', productos)

    /* Escucho los mensajes enviado por el cliente y se los propago a todos */
    socket.on('producto', data => {
        productos.push({ṕroducto: data })
        io.emit('productos', productos)
    })
})


// se levanta el servidor 
const PORT = 8080
const connectedServer = httpServer.listen(PORT, function () {
    console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))

// COMO SE CONECTAN EL ARCHIVO DEL USUARIO CON EL DEL SERVIDOR???

/*

app.get('/', (req, res) => {
    let products = unContenedor.getAll().then(products => res.render('form_carga',{products}))
    
});

app.post("/productos",(req,res) => {
    let newProduct = req.body
    let idNewProduct = unContenedor.save(newProduct).then(idNewProduct => {
        res.redirect('/')
    })
})

app.get('/productos', (req, res) => {
    let products = unContenedor.getAll().then(products => res.render('form_productos',{products}))
});

app
    .listen(8080, () => {
        console.log("Servidor corriendo en el puerto 8080")
    })
    .on("error", () => {
        console.log("Ha ocurrido un error")
    });
*/