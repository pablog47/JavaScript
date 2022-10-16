import Carrito from "./classes/Carrito.js"

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

const carrito = new Carrito()
const buscador = document.getElementById("buscador")
const tablaListaProductos = document.getElementById("tablaListaProductos")
const listaProductos = document.getElementById("listaProductos")
const notFound = document.getElementById("notFound")
const tablaCarritoProductos = document.getElementById("tablaCarritoProductos")
const carritoProductos = document.getElementById("carritoProductos")
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

const agregarProducto = (producto) => {
    carrito.agregarProducto(producto)
    renderizarCarrito()
}

const quitarProducto = (producto) => {
    carrito.quitarProducto(producto)
    if (!carrito.productos.length) {
        inputCuotas.value = ""
        total = 0
        cuotas = 1
    }
    renderizarCarrito()
}

const renderizarCarrito = () => {
    carritoProductos.innerHTML = ""
    total = 0
    if(carrito.productos.length) {
        tablaCarritoProductos.hidden = false
        carrito.productos.forEach((producto) => {
            const tableRow = document.createElement("tr")
            const botonQuitar = document.createElement("button")
            botonQuitar.innerHTML = `Quitar`
            botonQuitar.type = "button"
            botonQuitar.className = "btn btn-secondary bg-danger"
            botonQuitar.addEventListener("click", () => quitarProducto(producto))
            const nombre = document.createElement("td")
            const cantidad = document.createElement("td")
            const precio = document.createElement("td")
            const quitar = document.createElement("td")
            nombre.textContent = producto.nombre
            cantidad.textContent = producto.cantidad
            precio.textContent = `$${(producto.precio * producto.cantidad * IVA).toFixed(2)} (${producto.cantidad} x $${producto.precio} + IVA)`
            quitar.appendChild(botonQuitar)
            tableRow.appendChild(nombre)
            tableRow.appendChild(precio)
            tableRow.appendChild(quitar)
            carritoProductos.appendChild(tableRow)
            total += producto.precio * producto.cantidad * IVA
        })
    } else {
        tablaCarritoProductos.hidden = true
    }
    mostrarTotal()
}

const confirmarCuotas = () => {
    if(!carrito.productos.length) {
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
    if(productosFiltrados.length) {
        tablaListaProductos.hidden = false
        notFound.hidden = true
        listaProductos.innerHTML = ""
        productosFiltrados.forEach((producto) => {
            const tableRow = document.createElement("tr")
            const botonAgregar = document.createElement("button")
            botonAgregar.innerHTML = `Agregar`
            botonAgregar.type = "button"
            botonAgregar.className = "btn btn-secondary bg-primary"
            botonAgregar.addEventListener("click", () => agregarProducto(producto))
            const nombre = document.createElement("td")
            const imagen = document.createElement("td")
            const precio = document.createElement("td")
            const agregar = document.createElement("td")
            nombre.textContent = producto.nombre
            const img = document.createElement("img")
            img.src = producto.imagen
            img.classList.add("productThumbnail")
            imagen.appendChild(img)
            precio.textContent = producto.precio
            agregar.appendChild(botonAgregar)
            tableRow.appendChild(imagen)
            tableRow.appendChild(nombre)
            tableRow.appendChild(precio)
            tableRow.appendChild(agregar)
            listaProductos.appendChild(tableRow)
        })
    } else {
        tablaListaProductos.hidden = true
        notFound.hidden = false
        notFound.innerHTML = `No se han encontrado productos que coincidan con la búsqueda <b>${buscador.value}</b>.`
    }
}

buscador.addEventListener("input", filtrarProductos)
btnConfirmarCuotas.addEventListener("click", confirmarCuotas)

filtrarProductos()
renderizarCarrito()
