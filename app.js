function guardarFecha() {
    const fechaInput = document.getElementById("fechaPeriodo").value;

    if (!fechaInput) {
        alert("Selecciona una fecha");
        return;
    }

    let ciclos = JSON.parse(localStorage.getItem("ciclos")) || [];
    ciclos.push(fechaInput);

    localStorage.setItem("ciclos", JSON.stringify(ciclos));

    calcularPrediccion();
}

function calcularPrediccion() {
    let ciclos = JSON.parse(localStorage.getItem("ciclos")) || [];

    if (ciclos.length < 2) {
        document.getElementById("resultado").innerText =
            "Necesitas al menos 2 registros para calcular predicción.";
        generarCalendario();
        return;
    }

    let duraciones = [];

    for (let i = 1; i < ciclos.length; i++) {
        let fechaAnterior = new Date(ciclos[i - 1]);
        let fechaActual = new Date(ciclos[i]);

        let diferencia = (fechaActual - fechaAnterior) / (1000 * 60 * 60 * 24);
        duraciones.push(diferencia);
    }

    let suma = duraciones.reduce((a, b) => a + b, 0);
    let promedio = suma / duraciones.length;

    let ultimaFecha = new Date(ciclos[ciclos.length - 1]);

    let proximoPeriodo = new Date(ultimaFecha);
    proximoPeriodo.setDate(ultimaFecha.getDate() + Math.round(promedio));

    let diaOvulacion = Math.round(promedio) - 14;

    let fechaOvulacion = new Date(ultimaFecha);
    fechaOvulacion.setDate(ultimaFecha.getDate() + diaOvulacion);

    let inicioFertil = new Date(fechaOvulacion);
    inicioFertil.setDate(fechaOvulacion.getDate() - 3);

    let finFertil = new Date(fechaOvulacion);
    finFertil.setDate(fechaOvulacion.getDate() + 1);

    document.getElementById("resultado").innerText =
        "Promedio de ciclo: " + Math.round(promedio) + " días\n\n" +
        "Próximo periodo estimado: " + proximoPeriodo.toLocaleDateString() + "\n\n" +
        "Ventana fértil estimada:\n" +
        inicioFertil.toLocaleDateString() + " al " +
        finFertil.toLocaleDateString() +
        "\n\n⚠️ Estimación basada en método del calendario.";

    generarCalendario(proximoPeriodo, inicioFertil, finFertil, fechaOvulacion);
}

function generarCalendario(proximoPeriodo, inicioFertil, finFertil, fechaOvulacion) {
    const calendario = document.getElementById("calendario");
    calendario.innerHTML = "";

    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = hoy.getMonth();

    const ultimoDia = new Date(año, mes + 1, 0);

    for (let i = 1; i <= ultimoDia.getDate(); i++) {
        let fecha = new Date(año, mes, i);
        let divDia = document.createElement("div");
        divDia.classList.add("dia");
        divDia.innerText = i;

        if (fecha.toDateString() === hoy.toDateString()) {
            divDia.classList.add("hoy");
        }

        if (proximoPeriodo && fecha.toDateString() === proximoPeriodo.toDateString()) {
            divDia.classList.add("periodo");
        }

        if (inicioFertil && finFertil && fecha >= inicioFertil && fecha <= finFertil) {
            divDia.classList.add("fertil");
        }

        if (fechaOvulacion && fecha.toDateString() === fechaOvulacion.toDateString()) {
            divDia.classList.add("ovulacion");
        }

        calendario.appendChild(divDia);
    }
}

calcularPrediccion();
