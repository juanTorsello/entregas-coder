const fs = require('fs');


class Contenedor{


    constructor(_filename){
        this.filename = _filename
    }

    async save (producto){
        try{
            if(fs.existsSync(this.filename)){
                let result = await fs.promises.readFile(this.filename)
                let products = JSON.parse(result)
                let newID = (products.length > 0) ?  products[products.length-1].id + 1 : 1
                let newProduct = {
                    id : newID,
                    ...producto     
                }
                products.push(newProduct)
                await fs.promises.writeFile(this.filename, JSON.stringify(products),null,2)
                return newID
            }else{
                let newProduct = {
                    id : 1,
                    ...producto
                }      
                await fs.promises.writeFile(this.filename,JSON.stringify([newProduct],null,2))
                return 1
            }
        }
        catch(error){
            throw "hubo un error al ejecutar save " + error
        }
    }
        
    async getById(number){
        try {
            let products = await this.getAll()
            let producto = products.find(object => object.id == number)
            return (producto == undefined) ? null : producto
        } catch (error) {
            throw "hubo un error al ejecutar getById " + error
        }
        
    }

    async getAll(){
        try {
            let result = JSON.parse(await fs.promises.readFile(this.filename))
            return result   
        } catch (error) {
            throw "hubo un error al ejecutar getAll " + error
        }
    }

    async deleteById(number){
        try {
            let products = await this.getAll()
            for (let i = 0; i < products.length; i++) {
                if(products[i].id == number){
                    products.splice(i,1)
                }
            }
            await fs.promises.writeFile(this.filename, JSON.stringify(products),null,2)
        } catch (error) {
            throw "hubo un error al ejecutar deleteById " + error
        }

    }

    async deleteAll(){
        try {
            await fs.promises.writeFile(this.filename, JSON.stringify([]),null,2)    
        } catch (error) {
            throw "hubo un error al ejecutar deleteAll " + error
        }
        
    }
}

module.exports = {Contenedor: Contenedor}

