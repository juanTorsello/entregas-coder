const socket = io.connect();

const input = document.querySelector('input')
document.querySelector('button').addEventListener('click', () => {
    console.log(input.value)
    // socket.emit('producto', input.value);
})


// socket.on('productos', prods => {
//     console.log(prods)
//     const ProductosEJS = prods
//         .map(prod => `Titulo: ${prod.title}`)
//         .join('<br>')
//     document.querySelector('p').innerHTML = ProductosEJS
// });


/*
dudas:
- ver si esta bien conectado el main con el server en el encabezado
- ver como seria el hilo de ejecucion (??)
- ver si no falta ver la parte de los ficheros estaticos o es lo de viewFolder

*/