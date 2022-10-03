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
const productos = [
    {
        id: 1545,
        nombre: "Persona 5 Royale",
        precio: 12000,
    },
    {
        id: 1836,
        nombre: "Elden Ring",
        precio: 13000,
    },
    {
        id: 1962,
        nombre: "Tales Of Arise",
        precio: 12500,
    },
    {
        id: 1254,
        nombre: "Dark Souls Remaster",
        precio: 7000,
    },
    {
        id: 1100,
        nombre: "GTA V",
        precio: 5000,
    },
    {
        id: 1999,
        nombre: "Final Fantasy XVI (pre-order)",
        precio: 22000,
    },
    {
        id: 1755,
        nombre: "Stray",
        precio: 9000,
    },
    {
        id: 1423,
        nombre: "Nier: Replicant",
        precio: 11000,
    },
    {
        id: 1025,
        nombre: "Scarlet Nexus",
        precio: 10000,
    },
    {
        id: 1001,
        nombre: "Dragon Quest 11",
        precio: 10000,
    },
]

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
    if(!validarNumeroEnRango(numero, 1, productosFiltrados.length)) {
        alert("Opción inválida")
    } else {
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
    cuotas = parseInt(inputCuotas.value)
    if(!validarNumeroEnRango(cuotas, 1, 6)) {
        alert("Debe ingresar un número entre 1 y 6")
        cuotas = 1
    }
    localStorage.setItem("cuotas", JSON.stringify(cuotas))
    mostrarTotal()
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
