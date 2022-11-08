const { json } = require("express");
const express = require("express");
const { Router } = express;
const path = require("path")
const fs = require('fs');

const app  = express();
const routerApi = Router();

app.use(express.urlencoded({extended: true}))
app.use(express.json())


const modulo_Contenedor = require("../class_Contenedor");
const Contenedor = modulo_Contenedor.Contenedor
const fileName = "producto.txt"
const unContenedor = new Contenedor (fileName)

async function inicializar_contenedor(){
    
    await unContenedor.save({title: "auto",price: 100, thumbnail: "link1"/*"https://acroadtrip.blob.core.windows.net/catalogo-imagenes/m/RT_V_12aa5deef3794cc4ad0dfcd88426ef17.jpg"*/})
    await unContenedor.deleteAll()
}

inicializar_contenedor()


app.set('views', './views');
app.set('view engine', 'ejs');


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