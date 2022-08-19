
let input = prompt("ingresa un número positivo:")
let number = parseInt(input)

if (isNaN(number)) {
    alert(`${input} no es un número`)
} else if (number <= 0){
    alert(`${number} no es un número positivo`)
} else {
    console.log(`Cálculo de factorial de ${number}`)
    let factorial = number
    for(let i = number-1; i > 0 ; i--){
        console.log(`${Math.abs(i-number)}) ${factorial}`)
        factorial *= i
    }
    console.log(`El factorial de ${number} es ${factorial}`)
}

