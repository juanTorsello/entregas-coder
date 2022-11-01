const { json } = require("express");
const express = require("express");
const { Router } = express;
const path = require("path")

const app  = express();
const routerApi = Router();

app.use(express.urlencoded({extended: true}))
app.use(express.json())

const modulo_Contenedor = require("../class_Contenedor");
const Contenedor = modulo_Contenedor.Contenedor
const unContenedor = new Contenedor ("producto.txt")

async function inicializar_contenedor(){
    
    await unContenedor.save({title: "auto",price: 100, thumbnail: "link1"/*"https://acroadtrip.blob.core.windows.net/catalogo-imagenes/m/RT_V_12aa5deef3794cc4ad0dfcd88426ef17.jpg"*/})
    await unContenedor.save({title: "casa",price: 3500, thumbnail: "link2"/*"https://i.blogs.es/c68014/casa-3d/840_560.jpeg"*/}) 
    await unContenedor.save({title: "plato",price: 50, thumbnail: "link3"/*"https://img.freepik.com/vector-gratis/plato-blanco-realista-aislado_1284-41743.jpg?w=2000"*/}) 
}

inicializar_contenedor()


app.use("/api/productos",routerApi);


app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res) => {
    res.send("index.html");
});

routerApi.get("/",(req,res) => {
    let products = unContenedor.getAll().then(products => res.json(products))
})

routerApi.get("/:id",(req,res) => {
    let { id } = req.params
    let product = unContenedor.getById(id).then(product => {
        product == null ?  res.json({ error: "producto no encontrado"}) : res.json(product) 
    })
})

routerApi.post("/",(req,res) => {
    let newProduct = req.body
    let idNewProduct = unContenedor.save(newProduct).then(idNewProduct => {
        let resProduct = unContenedor.getById(idNewProduct).then(resProduct => res.json(resProduct))
    })
})

// en esta version intente mantener el id original, pero rompe cuando intento volver a guardar los productos nose porque

/*
routerApi.put("/:id",(req,res) => {
    let productData = req.body // cuando se hace la actualizacion de un producto, se manda la informacion completa 
    let { id } = req.params
    let products = unContenedor.getAll().then(products => {
        let newProduct = {
            id : Number(id),
            ...productData     
        }
        products[id-1] = newProduct
        unContenedor.deleteAll().then( empty => {
            products.forEach(element => {
                delete element.id
                console.log(element)
                unContenedor.save(element)
            });
        })
        

    })
    res.json("producto "+ id +  " actualizado correctamente")
    
})
*/

routerApi.put("/:id",(req,res) => {
    let productData = req.body // cuando se hace la actualizacion de un producto, se manda la informacion completa 
    let { id } = req.params
    unContenedor.deleteById(id).then(empty => {
        console.log(empty)
        newID = unContenedor.save(productData).then(newID => res.json("Producto actualizado con nuevo id: " + newID))
    })
})


routerApi.delete("/:id",(req,res) => {
    let { id } = req.params
    unContenedor.deleteById(id).then( res.json("producto eliminado con exito") )
})


app
    .listen(8080, () => {
        console.log("Servidor corriendo en el puerto 8080")
    })
    .on("error", () => {
        console.log("Ha ocurrido un error")
    });