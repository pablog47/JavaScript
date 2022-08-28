let numero = parseInt(prompt("Seleccione un producto (1-4):"))
let conCuotas = confirm("Desea abonar en cuotas?")
let cuotas = 1
const IVA = 1.21
const INTERES = 1.05
const validarNumeroEnRango = (num, min, max) => !isNaN(num) && num >= min && num <= max
const calcularPrecio = (precio, cuotas) => {
    const precioFinal = precio * IVA * (cuotas > 1 ? INTERES : 1)
    document.write(`El valor total de su compra (con IVA incluído) es de: $${precioFinal} en ${cuotas} cuota${cuotas > 1 ? `s de $${(precioFinal / cuotas).toFixed(2)}` : ""}.`)
}
if (!validarNumeroEnRango(numero, 1, 4)) {
    alert(`Debe ingresar un número entre 1 y 4`)
} else {
    if (conCuotas) {
        cuotas = parseInt(prompt("Indique cantidad de cuotas (1-6):"))
        if (!validarNumeroEnRango(cuotas, 1, 6)) {
            alert(`Debe ingresar un número entre 1 y 6`)
            cuotas = 1
        }
    }
    switch (numero) {
        case 1:
            precio = 12000
            break
        case 2:
            precio = 12500
            break
        case 3:
            precio = 8000
            break
        case 4:
            precio = 15000
            break
        default:
            break
    }
    calcularPrecio(precio, cuotas)
}
