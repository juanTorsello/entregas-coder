const express = require('express')
const server = express()

const modulo_Contenedor = require("./class_Contenedor");
const Contenedor = modulo_Contenedor.Contenedor
const unContenedor = new Contenedor ("producto.txt")

async function inicializar_archivo(){
    
    await unContenedor.save({title: "auto",price: 100, thumbnail: "https://acroadtrip.blob.core.windows.net/catalogo-imagenes/m/RT_V_12aa5deef3794cc4ad0dfcd88426ef17.jpg"})
    await unContenedor.save({title: "casa",price: 3500, thumbnail: "https://i.blogs.es/c68014/casa-3d/840_560.jpeg"}) 
    await unContenedor.save({title: "plato",price: 50, thumbnail: "https://img.freepik.com/vector-gratis/plato-blanco-realista-aislado_1284-41743.jpg?w=2000"}) 
}

async function  getProducts(){
    allProducts = await unContenedor.getAll()
    return allProducts
}

inicializar_archivo()

server.get('/productos',(req,resp) => {
    products = getProducts().then(products => resp.send(JSON.stringify(products)))
})


server.get('/productoRandom',(req,resp) => {
    products = getProducts().then(products => resp.send(products[Math.floor(Math.random() * products.length)])) 
})


const PORT = 8080

server.listen(PORT,() => {
    console.log(`Servidor Express escuchando en el puerto ` + PORT)
})

server.on("error", error => console.log(`Error de servidor ${error}`))

