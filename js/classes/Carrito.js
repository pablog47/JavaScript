export default class Carrito {
    constructor() {
        this.productos = JSON.parse(localStorage.getItem("carrito")) || []
    }
    agregarProducto(producto) {
        const index = this.productos.findIndex(elem => elem.id === producto.id)
        if (index !== -1) {
            this.productos[index] = { ...this.productos[index], cantidad: this.productos[index].cantidad + 1 }
        } else {
            this.productos.push({ ...producto, cantidad: 1 })
        }
        localStorage.setItem("carrito", JSON.stringify(this.productos))
    
    }
    quitarProducto(producto) {
        this.productos = this.productos.filter((item) => item.id !== producto.id)
        localStorage.setItem("carrito", JSON.stringify(this.productos))
    }
}
