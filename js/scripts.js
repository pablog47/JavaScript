let productos = []
const dataURL = "./js/data/data.json"

let cuotas = JSON.parse(localStorage.getItem("cuotas")) || 1
const IVA = 1.21
const INTERES = 1.05
let total = 0
const validarNumeroEnRango = (num, min, max) => !isNaN(num) && num >= min && num <= max
const calcularPrecio = (precio, cuotas) => {
    const precioFinal = precio * IVA * (cuotas > 1 ? INTERES : 1)
    document.write(`El valor total de su compra (con IVA incluído) es de: $${precioFinal} en ${cuotas} cuota${cuotas > 1 ? `s de $${(precioFinal / cuotas).toFixed(2)}` : ""}.`)
}

let carrito = JSON.parse(localStorage.getItem("carrito")) || []
const buscador = document.getElementById("buscador")
const listaProductos = document.getElementById("listaProductos")
const carritoProductos = document.getElementById("carritoProductos")
const inputProducto = document.getElementById("indiceProducto")
const inputCuotas = document.getElementById("cantidadCuotas")
const totalCompra = document.getElementById("totalCompra")
const btnConfirmarCuotas = document.getElementById("confirmarCuotas")

const alert = (texto) => Swal.fire({
    icon: 'error',
    title: 'Alerta',
    text: texto,
})
const cargarProductos = async () => {
    try {
        const response = await fetch(dataURL)
        const data = await response.json()
        productos = data
    } catch (e) {
        alert("Algo salió mal")
        console.error(e)
    } finally {
        filtrarProductos()
    }
}
cargarProductos()

let productosFiltrados = []

const filtrarProductos = () => {   
    const texto = buscador.value
    if(texto) {
        productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(texto))
    } else {
        productosFiltrados = productos
    }
    renderizarProductos()
}

const agregarProducto = (numero) => {
    const producto = productosFiltrados[numero-1]
    const index = carrito.findIndex(elem => elem.id === producto.id)
    if(index !== -1) {
        carrito[index] = { ...carrito[index], cantidad: carrito[index].cantidad + 1 }
    } else {
        carrito.push({ ...producto, cantidad: 1 })
    }
    localStorage.setItem("carrito", JSON.stringify(carrito))
    renderizarCarrito()
}

const quitarProducto = (numero) => {
    carrito = carrito.filter((_item, i) => i !== numero)  
    if(!carrito.length) {
        total = 0
        cuotas = 1
        inputCuotas.value = ""
    }
    localStorage.setItem("carrito", JSON.stringify(carrito))
    renderizarCarrito()
}

const renderizarCarrito = () => {
    carritoProductos.innerHTML = ""
    total = 0
    carrito.forEach((articulo, i) => {
        const item = document.createElement("li")
        item.className = "m-2"
        const botonQuitar = document.createElement("button")
        botonQuitar.innerHTML = `Quitar`
        botonQuitar.type = "button"
        botonQuitar.className = "btn btn-secondary"
        botonQuitar.addEventListener("click", () => quitarProducto(i))
        item.innerHTML = `<span>${articulo.nombre} - $${(articulo.precio * articulo.cantidad * IVA).toFixed(2)} (${articulo.cantidad} x $${articulo.precio} + IVA)</span>`
        item.appendChild(botonQuitar)
        carritoProductos.appendChild(item)
        total += articulo.precio * articulo.cantidad * IVA
    })
    mostrarTotal()
}

const confirmarCuotas = () => {
    if(!carrito.length) {
        alert('El carrito está vacío')
    } else {
        cuotas = parseInt(inputCuotas.value)
        if(!validarNumeroEnRango(cuotas, 1, 6)) {
            alert("Debe ingresar un número de cuotas entre 1 y 6")
            cuotas = 1
        }
        localStorage.setItem("cuotas", JSON.stringify(cuotas))
        mostrarTotal()
    }
}

const mostrarTotal = () => {
    if(total) {
        const totalAMostrar = cuotas !== 1 ? total * INTERES : total
        totalCompra.innerHTML = `Total de la compra: $${totalAMostrar.toFixed(2)}${cuotas !== 1 ? ` en ${cuotas} pagos de $${(totalAMostrar / cuotas).toFixed(2)} (con 5% de interés)` : ''}`
    } else {
        totalCompra.innerHTML = ""
    }
}

const renderizarProductos = () => {
    listaProductos.innerHTML = ""
    if(productosFiltrados.length) {
        productosFiltrados.forEach((producto, i) => {
            const item = document.createElement("li")
            item.className = "m-2"
            const botonAgregar = document.createElement("button")
            botonAgregar.innerHTML = `Agregar`
            botonAgregar.type = "button"
            botonAgregar.className = "btn btn-secondary"
            botonAgregar.addEventListener("click", () => agregarProducto(i+1))
            item.innerHTML = `<span>${producto.nombre} - $${producto.precio} (${producto.id})</span>`
            item.appendChild(botonAgregar)
            listaProductos.appendChild(item)
        })
    } else {
        listaProductos.innerHTML = `No se han encontrado productos que coincidan con la búsqueda <b>${buscador.value}</b>.`
    }
}

buscador.addEventListener("input", filtrarProductos)
btnConfirmarCuotas.addEventListener("click", confirmarCuotas)

filtrarProductos()
renderizarCarrito()
