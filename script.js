// Array de palabras con sus pistas (una sola palabra)
// Puedes agregar más palabras aquí siguiendo el formato: { palabra: "palabra", pista: "pista" }
const palabras = [
    { palabra: "Hospital", pista: "Enfermedad" },
    { palabra: "Escuela", pista: "Estudiar" },
    { palabra: "Restaurante", pista: "Comida" },
    { palabra: "Aeropuerto", pista: "Avión" },
    { palabra: "Biblioteca", pista: "Libros" },
    { palabra: "Supermercado", pista: "Compras" },
    { palabra: "Playa", pista: "Arena" },
    { palabra: "Montaña", pista: "Alto" },
    { palabra: "Ciudad", pista: "Edificios" },
    { palabra: "Bosque", pista: "Árboles" }
];

// Estado del juego
let jugadores = [];
let impostores = [];
let palabraActual = null;
let numImpostores = 1;

// Elementos del DOM
const pantallaInicial = document.getElementById('pantalla-inicial');
const pantallaTarjetas = document.getElementById('pantalla-tarjetas');
const pantallaRevelacion = document.getElementById('pantalla-revelacion');
const numImpostoresInput = document.getElementById('num-impostores');
const nombreJugadorInput = document.getElementById('nombre-jugador');
const agregarJugadorBtn = document.getElementById('agregar-jugador');
const iniciarJuegoBtn = document.getElementById('iniciar-juego');
const listaJugadores = document.getElementById('lista-jugadores');
const contenedorTarjetas = document.getElementById('contenedor-tarjetas');
const todosVieronBtn = document.getElementById('todos-vieron');
const revelarImpostoresBtn = document.getElementById('revelar-impostores');
const nuevoJuegoBtn = document.getElementById('nuevo-juego');
const infoJuego = document.getElementById('info-juego');
const resultadoImpostores = document.getElementById('resultado-impostores');
const masInfoBtn = document.getElementById('mas-info');
const infoDetallada = document.getElementById('info-detallada');

// Event Listeners
agregarJugadorBtn.addEventListener('click', agregarJugador);
nombreJugadorInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        agregarJugador();
    }
});
iniciarJuegoBtn.addEventListener('click', iniciarJuego);
todosVieronBtn.addEventListener('click', mostrarPantallaRevelacion);
revelarImpostoresBtn.addEventListener('click', revelarImpostores);
nuevoJuegoBtn.addEventListener('click', nuevoJuego);
masInfoBtn.addEventListener('click', mostrarMasInfo);

// Funciones
function agregarJugador() {
    const nombre = nombreJugadorInput.value.trim();
    
    if (nombre === '') {
        alert('Por favor ingresa un nombre');
        return;
    }
    
    if (jugadores.includes(nombre)) {
        alert('Este jugador ya está agregado');
        return;
    }
    
    jugadores.push(nombre);
    nombreJugadorInput.value = '';
    actualizarListaJugadores();
    actualizarBotonIniciar();
}

function actualizarListaJugadores() {
    listaJugadores.innerHTML = '';
    
    if (jugadores.length === 0) {
        listaJugadores.innerHTML = '<p style="text-align: center; color: #6a6a7e;">No hay jugadores agregados</p>';
        return;
    }
    
    jugadores.forEach((jugador, index) => {
        const item = document.createElement('div');
        item.className = 'jugador-item';
        item.innerHTML = `
            <span>${jugador}</span>
            <button class="btn btn-eliminar" onclick="eliminarJugador(${index})">Eliminar</button>
        `;
        listaJugadores.appendChild(item);
    });
}

function eliminarJugador(index) {
    jugadores.splice(index, 1);
    actualizarListaJugadores();
    actualizarBotonIniciar();
}

function actualizarBotonIniciar() {
    numImpostores = parseInt(numImpostoresInput.value) || 1;
    const minJugadores = numImpostores + 1;
    
    if (jugadores.length >= minJugadores) {
        iniciarJuegoBtn.disabled = false;
    } else {
        iniciarJuegoBtn.disabled = true;
    }
}

numImpostoresInput.addEventListener('input', actualizarBotonIniciar);

function iniciarJuego() {
    numImpostores = parseInt(numImpostoresInput.value) || 1;
    
    if (jugadores.length < numImpostores + 1) {
        alert(`Necesitas al menos ${numImpostores + 1} jugadores para tener ${numImpostores} impostor(es)`);
        return;
    }
    
    // Seleccionar palabra aleatoria
    palabraActual = palabras[Math.floor(Math.random() * palabras.length)];
    
    // Seleccionar impostores aleatorios
    impostores = [];
    const jugadoresCopia = [...jugadores];
    
    for (let i = 0; i < numImpostores; i++) {
        const indiceAleatorio = Math.floor(Math.random() * jugadoresCopia.length);
        impostores.push(jugadoresCopia[indiceAleatorio]);
        jugadoresCopia.splice(indiceAleatorio, 1);
    }
    
    // Cambiar a pantalla de tarjetas
    pantallaInicial.classList.remove('activa');
    pantallaTarjetas.classList.add('activa');
    
    // Crear tarjetas
    crearTarjetas();
}

function crearTarjetas() {
    contenedorTarjetas.innerHTML = '';
    
    jugadores.forEach(jugador => {
        const esImpostor = impostores.includes(jugador);
        
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta';
        if (esImpostor) {
            tarjeta.classList.add('tarjeta-impostor-tipo');
        } else {
            tarjeta.classList.add('tarjeta-jugador-tipo');
        }
        tarjeta.innerHTML = `
            <div class="tarjeta-nombre">${jugador}</div>
            <div class="tarjeta-contenido">
                ${esImpostor 
                    ? `<div class="tarjeta-impostor">ERES EL IMPOSTOR</div>
                       <div class="tarjeta-pista">${palabraActual.pista.toUpperCase()}</div>`
                    : `<div class="tarjeta-palabra">${palabraActual.palabra}</div>`
                }
            </div>
            <div class="tarjeta-mensaje">
                Haz clic para ver tu tarjeta
            </div>
        `;
        
        tarjeta.addEventListener('click', () => {
            if (tarjeta.classList.contains('vista')) {
                // Si ya está vista, no hacer nada
                return;
            }
            
            const contenido = tarjeta.querySelector('.tarjeta-contenido');
            const mensaje = tarjeta.querySelector('.tarjeta-mensaje');
            
            if (tarjeta.classList.contains('mostrando')) {
                // Segundo toque: ocultar y marcar como vista
                contenido.style.display = 'none';
                tarjeta.classList.remove('mostrando');
                tarjeta.classList.add('vista');
                tarjeta.style.pointerEvents = 'none';
            } else {
                // Primer toque: mostrar contenido
                tarjeta.classList.add('mostrando');
                contenido.style.display = 'block';
                mensaje.style.display = 'none';
            }
        });
        
        contenedorTarjetas.appendChild(tarjeta);
    });
}

function mostrarPantallaRevelacion() {
    pantallaTarjetas.classList.remove('activa');
    pantallaRevelacion.classList.add('activa');
    
    // Seleccionar jugador que empieza aleatoriamente
    const jugadorInicia = jugadores[Math.floor(Math.random() * jugadores.length)];
    
    // Mostrar solo quién empieza (visible para todos)
    infoJuego.innerHTML = `
        <h3>Información del Juego</h3>
        <p><strong>Jugador que empieza:</strong> ${jugadorInicia}</p>
    `;
    
    // Preparar información detallada (oculta inicialmente)
    infoDetallada.innerHTML = `
        <p><strong>Palabra:</strong> ${palabraActual.palabra}</p>
        <p><strong>Pista:</strong> ${palabraActual.pista}</p>
        <p><strong>Número de impostores:</strong> ${impostores.length}</p>
    `;
    infoDetallada.style.display = 'none';
    
    resultadoImpostores.classList.remove('mostrar');
    resultadoImpostores.innerHTML = '';
    masInfoBtn.textContent = 'Más Información';
    revelarImpostoresBtn.textContent = 'Revelar Impostores';
}

function mostrarMasInfo() {
    if (infoDetallada.style.display === 'none' || infoDetallada.style.display === '') {
        infoDetallada.style.display = 'block';
        masInfoBtn.textContent = 'Ocultar Información';
    } else {
        infoDetallada.style.display = 'none';
        masInfoBtn.textContent = 'Más Información';
    }
}

function revelarImpostores() {
    if (resultadoImpostores.classList.contains('mostrar')) {
        // Si ya está mostrando, ocultar
        resultadoImpostores.classList.remove('mostrar');
        revelarImpostoresBtn.textContent = 'Revelar Impostores';
    } else {
        // Mostrar impostores
        resultadoImpostores.classList.add('mostrar');
        resultadoImpostores.innerHTML = '<h3 style="margin-bottom: 15px;">Resultados:</h3>';
        
        // Mostrar impostores
        impostores.forEach(impostor => {
            const div = document.createElement('div');
            div.className = 'impostor-revelado';
            div.textContent = `${impostor} - IMPOSTOR`;
            resultadoImpostores.appendChild(div);
        });
        
        // Mostrar jugadores normales
        jugadores.forEach(jugador => {
            if (!impostores.includes(jugador)) {
                const div = document.createElement('div');
                div.className = 'jugador-normal';
                div.textContent = `${jugador} - Ciudadano`;
                resultadoImpostores.appendChild(div);
            }
        });
        
        revelarImpostoresBtn.textContent = 'Ocultar Impostores';
    }
}

function nuevoJuego() {
    // Resetear estado
    jugadores = [];
    impostores = [];
    palabraActual = null;
    numImpostores = 1;
    
    // Resetear UI
    nombreJugadorInput.value = '';
    numImpostoresInput.value = 1;
    listaJugadores.innerHTML = '';
    contenedorTarjetas.innerHTML = '';
    resultadoImpostores.classList.remove('mostrar');
    resultadoImpostores.innerHTML = '';
    infoDetallada.style.display = 'none';
    masInfoBtn.textContent = 'Más Información';
    revelarImpostoresBtn.textContent = 'Revelar Impostores';
    
    // Volver a pantalla inicial
    pantallaRevelacion.classList.remove('activa');
    pantallaTarjetas.classList.remove('activa');
    pantallaInicial.classList.add('activa');
    
    actualizarBotonIniciar();
}

// Inicializar
actualizarListaJugadores();
actualizarBotonIniciar();

