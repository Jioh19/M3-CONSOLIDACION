//*Un increíble objeto de 2 atributos. Mas que anda para usar Proxy
const presupuesto = {
	haber: 0,
	debe: 0,
};

function Gasto(nombreGasto, montoGasto) {
	this.nombreGasto = nombreGasto;
	this.montoGasto = montoGasto;
}

const handlerPresupuesto = {
	set: function (obj, prop, value) {
		if (typeof value == "number" && value > 0) {
			obj[prop] = value;
		} else {
			alert("Ingrese un monto válido");
		}
	},
	get: function (obj, prop) {
		return obj[prop];
	},
};

//! Para demostrar que aprendí algo extra.... haciéndome cargo de los casos
//! donde no se pueda crear el objeto. Seguramente hay una forma mas fácil
//! de hacer esto mismo. Creo que estas eran las variables ES6
const handlerGasto = {
	construct(gasto, args) {
		if (args[0] == "") {
			alert("Ingrese Nombre del Gasto");
			return false;
		}
		if (args[1] < 0) {
			alert("Ingrese un monto válido");
			return false;
		}
		return new gasto(...args);
	},
	get: function (obj, prop) {
		return obj[prop];
	},
};

const proxyPresupuesto = new Proxy(presupuesto, handlerPresupuesto);
const proxyGasto = new Proxy(Gasto, handlerGasto);
const gastos = [];

// Usando a la fuerza las funciones flecha.... No hacen Hoist, por lo que en este caso
// tienen 0 utilidad por sobre las funciones tradicionales. Personalmente las funciones
// flecha no me parecen mas claras que la función tradicional (similarmente utilizada en otros lenguajes)
const agregarPresupuesto = () => {
	proxyPresupuesto.haber = Number(document.querySelector("#agregarPresupuesto").value);
	document.querySelector("#valorPresupuestos").innerHTML = `$${proxyPresupuesto.haber}`;
	actualizarSaldo();
};

// Pensaba hacer un chequeo de saldo negativo, pero me di cuenta que tiene mas sentido ver
// un saldo negativo para ver cuanto falta para poder cubrir los gastos.
const actualizarSaldo = () => {
	document.querySelector("#valorPresupuestos").innerHTML = `$${proxyPresupuesto.haber}`;
	document.querySelector("#valorSaldos").innerHTML = `$${proxyPresupuesto.haber - proxyPresupuesto.debe}`;
	document.querySelector("#valorGastos").innerHTML = `$${proxyPresupuesto.debe}`;
};

// Agrego los gastos en un arreglo. Me imagino que para esta situacion pedian arreglos/matrices
// Ademas de un if y un try catch
function agregarGasto() {
	let nombre = document.querySelector("#nombreGasto").value;
	let monto = Number(document.querySelector("#montoGasto").value);
	try {
		let gasto = new proxyGasto(nombre, monto);
		if (gasto) {
			gastos.push(gasto);
		}
	} catch (err) {
		console.log(err);
	}
	proxyPresupuesto.debe += monto;
	actualizarSaldo();
	imprimirGasto();
	console.log(gastos);
}

// Una funcion for para generar la lista de gastos
function imprimirGasto() {
	let nodo = document.querySelector("#listaGastos");
	nodo.innerHTML = "";
	for (let i in gastos) {
		nodo.innerHTML += `<p id="itemGasto">${gastos[i].nombreGasto}</p>
        <p id="itemValor">$${gastos[i].montoGasto}</p>
        <img src="./assets/img/rubbish-bin-svgrepo-com.svg" class="savage"
        id="savage-${i}" alt="" onclick="eliminarGasto()">`;
	}
}
