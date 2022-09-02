let cuotas = 1
const IVA = 1.21
const INTERES = 1.05
let total = 0
const nuevoID = () => parseInt(Math.random() * 100000)
const validarNumeroEnRango = (num, min, max) => !isNaN(num) && num >= min && num <= max
const calcularPrecio = (precio, cuotas) => {
    const precioFinal = precio * IVA * (cuotas > 1 ? INTERES : 1)
    document.write(`El valor total de su compra (con IVA incluído) es de: $${precioFinal} en ${cuotas} cuota${cuotas > 1 ? `s de $${(precioFinal / cuotas).toFixed(2)}` : ""}.`)
}

let carrito = []
const listaProductos = document.getElementById("listaProductos")
const carritoProductos = document.getElementById("carritoProductos")
const inputProducto = document.getElementById("indiceProducto")
const inputCuotas = document.getElementById("cantidadCuotas")
const totalCompra = document.getElementById("totalCompra")
const productos = [
    {
        id: nuevoID(),
        nombre: "Persona 5 Royale",
        precio: 12000,
    },
    {
        id: nuevoID(),
        nombre: "Elden Ring",
        precio: 13000,
    },
    {
        id: nuevoID(),
        nombre: "Tales Of Arise",
        precio: 12500,
    },
    {
        id: nuevoID(),
        nombre: "Dark Souls Remaster",
        precio: 7000,
    },
    {
        id: nuevoID(),
        nombre: "GTA V",
        precio: 5000,
    },
    {
        id: nuevoID(),
        nombre: "Final Fantasy XVI (pre-order)",
        precio: 22000,
    },
    {
        id: nuevoID(),
        nombre: "Stray",
        precio: 9000,
    },
    {
        id: nuevoID(),
        nombre: "Nier: Replicant",
        precio: 11000,
    },
    {
        id: nuevoID(),
        nombre: "Scarlet Nexus",
        precio: 10000,
    },
    {
        id: nuevoID(),
        nombre: "Dragon Quest 11",
        precio: 10000,
    },
]

productos.forEach(producto => {
    const item = document.createElement("li")
    item.appendChild(document.createTextNode(`${producto.nombre} - $${producto.precio} (${producto.id})`))
    listaProductos.appendChild(item)
})

const agregarProducto = () => {
    const numero = parseInt(inputProducto.value)
    if(!validarNumeroEnRango(numero, 1, 10)) {
        alert("Debe ingresar un número entre 1 y 10")
    } else {
        const producto = productos[numero-1]
        const index = carrito.findIndex(elem => elem.id === producto.id)
        if(index !== -1) {
            carrito[index] = { ...carrito[index], cantidad: carrito[index].cantidad + 1 }
        } else {
            carrito.push({ ...producto, cantidad: 1 })
        }
        carritoProductos.innerHTML = ""
        total = 0
        carrito.forEach(articulo => {
            const item = document.createElement("li")
            item.appendChild(document.createTextNode(`${articulo.nombre} - $${(articulo.precio * articulo.cantidad * IVA).toFixed(2)} (${articulo.cantidad} x $${articulo.precio} + IVA)`))
            carritoProductos.appendChild(item)
            total += articulo.precio * articulo.cantidad * IVA
        })
        mostrarTotal()
    }
}

const confirmarCuotas = () => {
    cuotas = parseInt(inputCuotas.value)
    if(!validarNumeroEnRango(cuotas, 1, 6)) {
        alert("Debe ingresar un número entre 1 y 6")
        cuotas = 1
    }
    mostrarTotal()
}

const mostrarTotal = () => {
    if(total) {
        total = cuotas !== 1 ? total * INTERES : total
        totalCompra.innerHTML = ""
        totalCompra.appendChild(document.createTextNode(`Total de la compra: $${total.toFixed(2)}${cuotas !== 1 ? ` en ${cuotas} pagos de $${(total / cuotas).toFixed(2)} (con 5% de interés)` : ''}`))
    }
}
