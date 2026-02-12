function guardarFecha() {
    const fechaInput = document.getElementById("fechaPeriodo").value;

    if (!fechaInput) {
        alert("Selecciona una fecha");
        return;
    }

    // Obtener fechas guardadas
    let ciclos = JSON.parse(localStorage.getItem("ciclos")) || [];

    // Guardar nueva fecha
    ciclos.push(fechaInput);

    // Guardar en almacenamiento local
    localStorage.setItem("ciclos", JSON.stringify(ciclos));

    calcularPrediccion();
}

function calcularPrediccion() {
    let ciclos = JSON.parse(localStorage.getItem("ciclos")) || [];

    if (ciclos.length < 2) {
        document.getElementById("resultado").innerText =
            "Necesitas al menos 2 registros para calcular predicción.";
        return;
    }

    let duraciones = [];

    for (let i = 1; i < ciclos.length; i++) {
        let fechaAnterior = new Date(ciclos[i - 1]);
        let fechaActual = new Date(ciclos[i]);

        let diferencia = (fechaActual - fechaAnterior) / (1000 * 60 * 60 * 24);
        duraciones.push(diferencia);
    }

    // Promedio simple (primera versión)
    let suma = duraciones.reduce((a, b) => a + b, 0);
    let promedio = suma / duraciones.length;

    let ultimaFecha = new Date(ciclos[ciclos.length - 1]);
    let proximoPeriodo = new Date(ultimaFecha);
    proximoPeriodo.setDate(ultimaFecha.getDate() + Math.round(promedio));

    document.getElementById("resultado").innerText =
        "Promedio de ciclo: " + Math.round(promedio) + " días\n" +
        "Próximo periodo estimado: " + proximoPeriodo.toLocaleDateString();
}

calcularPrediccion();
