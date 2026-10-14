//Palabras invertidas
function invertirPalabras(texto: string): string {
  return texto
    .split(' ')
    .map((palabra) => palabra.split('').reverse().join(''))
    .join(' ');
}

console.log(invertirPalabras('Hola mundo desde TypeScript'));


//Pares unicos
function obtenerParesUnicos(numeros: number[]): number[] {
    let resultado: number[] = [];

    for (let i = 0; i < numeros.length; i++) {
        let numero = numeros[i];

        if (numero !== undefined && numero % 2 === 0) {
            if (!resultado.includes(numero)) {
                resultado.push(numero);
            }
        }
    }

    return resultado;
}

console.log(obtenerParesUnicos([2, 5, 8, 2, 10, 7, 8, 4, 5, 10]));

//Numeros primos
function esPrimo(numero: number): boolean {
    if (numero < 2) {
        return false;
    }

    for (let i = 2; i < numero; i++) {
        if (numero % i === 0) {
            return false;
        }
    }

    return true;
}

//Primos gemelos

function primosGemelos(inicio: number, fin: number): number[][] {
    let resultado: number[][] = [];

    for (let i = inicio; i <= fin - 2; i++) {
        if (esPrimo(i) && esPrimo(i + 2)) {
            resultado.push([i, i + 2]);
        }
    }

    return resultado;
}

console.log(primosGemelos(1, 20));



function sumaSubconjunto(numeros: number[], objetivo: number): boolean {
    for (let i = 0; i < numeros.length; i++) {
        if (numeros[i] === objetivo) {
            return true;
        }

        let resto = numeros.slice(i + 1);

        if (resto.length > 0) {
            if (sumaSubconjunto(resto, objetivo - numeros[i]!)) {
                return true;
            }
        }
    }

    return false;
}

console.log(sumaSubconjunto([2, 4, 7, 10], 11));
console.log(sumaSubconjunto([2, 4, 7, 10], 20));