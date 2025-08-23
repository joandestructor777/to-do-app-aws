document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const entradaTarea = document.querySelector('.entrada-tarea');
    const botonAgregar = document.querySelector('.boton-agregar');
    const listaTareas = document.getElementById('listaTareas');
    const tiempoElemento = document.getElementById('tiempo');
    const botonIniciar = document.getElementById('iniciar');
    const botonPausar = document.getElementById('pausar');
    const botonReiniciar = document.getElementById('reiniciar');
    const botonesModo = document.querySelectorAll('.boton-modo');
    const contadorElemento = document.getElementById('contador');
    const notificacion = document.getElementById('notificacion');

    // Variables para el Pomodoro
    let temporizador;
    let tiempoRestante = 25 * 60;
    let temporizadorActivo = false;
    let modoActual = 'trabajo';
    let contadorPomodoros = 0;

    // Tiempos para cada modo (en segundos)
    const tiempos = {
        'trabajo': 25 * 60,
        'descanso-corto': 5 * 60,
        'descanso-largo': 15 * 60
    };

    // Cargar datos desde localStorage
    cargarTareas();
    cargarContadorPomodoros();

    // Event Listeners para la lista de tareas
    botonAgregar.addEventListener('click', agregarTarea);
    entradaTarea.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            agregarTarea();
        }
    });

    // Event Listeners para el Pomodoro
    botonIniciar.addEventListener('click', iniciarTemporizador);
    botonPausar.addEventListener('click', pausarTemporizador);
    botonReiniciar.addEventListener('click', reiniciarTemporizador);
    
    botonesModo.forEach(boton => {
        boton.addEventListener('click', function() {
            cambiarModo(this.dataset.modo);
        });
    });

    // Funciones para la lista de tareas
    function agregarTarea() {
        const texto = entradaTarea.value.trim();
        
        if (texto === '') {
            return;
        }
        
        const tarea = {
            id: Date.now(),
            texto: texto,
            completada: false
        };
        
        agregarTareaAlDOM(tarea);
        guardarTareas();
        
        entradaTarea.value = '';
        entradaTarea.focus();
    }

    function agregarTareaAlDOM(tarea) {
        const li = document.createElement('li');
        li.className = 'tarea';
        li.dataset.id = tarea.id;
        
        if (tarea.completada) {
            li.classList.add('tarea-completada');
        }
        
        li.innerHTML = `
            <button class="boton-accion boton-completar">✔</button>
            <span class="texto-tarea">${tarea.texto}</span>
            <button class="boton-accion boton-eliminar">🗑</button>
        `;
        
        li.querySelector('.boton-completar').addEventListener('click', toggleTareaCompletada);
        li.querySelector('.boton-eliminar').addEventListener('click', eliminarTarea);
        
        listaTareas.appendChild(li);
    }

    function toggleTareaCompletada(e) {
        const li = e.target.closest('.tarea');
        const id = parseInt(li.dataset.id);
        
        let tareas = obtenerTareas();
        const tarea = tareas.find(t => t.id === id);
        tarea.completada = !tarea.completada;
        
        guardarTareasEnLS(tareas);
        
        li.classList.toggle('tarea-completada');
    }

    function eliminarTarea(e) {
        const li = e.target.closest('.tarea');
        const id = parseInt(li.dataset.id);
        
        let tareas = obtenerTareas();
        tareas = tareas.filter(t => t.id !== id);
        
        guardarTareasEnLS(tareas);
        li.remove();
    }

    function obtenerTareas() {
        return JSON.parse(localStorage.getItem('tareas')) || [];
    }

    function guardarTareas() {
        const tareas = [];
        document.querySelectorAll('.tarea').forEach(tareaElement => {
            tareas.push({
                id: parseInt(tareaElement.dataset.id),
                texto: tareaElement.querySelector('.texto-tarea').textContent,
                completada: tareaElement.classList.contains('tarea-completada')
            });
        });
        
        guardarTareasEnLS(tareas);
    }

    function guardarTareasEnLS(tareas) {
        localStorage.setItem('tareas', JSON.stringify(tareas));
    }

    function cargarTareas() {
        const tareas = obtenerTareas();
        tareas.forEach(tarea => agregarTareaAlDOM(tarea));
    }

    // Funciones para el Pomodoro
    function actualizarTiempo() {
        const minutos = Math.floor(tiempoRestante / 60);
        const segundos = tiempoRestante % 60;
        
        tiempoElemento.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        
        document.title = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')} - FocusTask`;
        
        if (tiempoRestante === 0) {
            clearInterval(temporizador);
            temporizadorActivo = false;
            
            if (modoActual === 'trabajo') {
                contadorPomodoros++;
                contadorElemento.textContent = contadorPomodoros;
                guardarContadorPomodoros();
                
                // Cambiar a descanso corto después de un pomodoro completado
                cambiarModo('descanso-corto');
            } else {
                // Después de un descanso, volver al modo trabajo
                cambiarModo('trabajo');
            }
            
            mostrarNotificacion();
            reproducirSonido();
        } else {
            tiempoRestante--;
        }
    }

    function iniciarTemporizador() {
        if (!temporizadorActivo) {
            temporizadorActivo = true;
            temporizador = setInterval(actualizarTiempo, 1000);
        }
    }

    function pausarTemporizador() {
        clearInterval(temporizador);
        temporizadorActivo = false;
    }

    function reiniciarTemporizador() {
        pausarTemporizador();
        tiempoRestante = tiempos[modoActual];
        actualizarTiempo();
    }

    function cambiarModo(modo) {
        modoActual = modo;
        tiempoRestante = tiempos[modo];
        
        // Actualizar botones de modo
        botonesModo.forEach(boton => {
            if (boton.dataset.modo === modo) {
                boton.classList.add('activo');
            } else {
                boton.classList.remove('activo');
            }
        });
        
        // Actualizar interfaz
        actualizarTiempo();
        
        // Si el temporizador estaba activo, lo reiniciamos
        if (temporizadorActivo) {
            reiniciarTemporizador();
            iniciarTemporizador();
        }
    }

    function mostrarNotificacion() {
        notificacion.textContent = modoActual === 'trabajo' 
            ? '¡Pomodoro completado! Toma un descanso.' 
            : '¡Descanso completado! Volvamos al trabajo.';
        
        notificacion.classList.add('mostrar');
        
        setTimeout(() => {
            notificacion.classList.remove('mostrar');
        }, 3000);
    }

    function reproducirSonido() {
        // Crear un sonido simple usando el API de Audio
        const contexto = new (window.AudioContext || window.webkitAudioContext)();
        const oscilador = contexto.createOscillator();
        
        oscilador.type = 'sine';
        oscilador.frequency.setValueAtTime(800, contexto.currentTime);
        
        const ganancia = contexto.createGain();
        ganancia.gain.setValueAtTime(0.5, contexto.currentTime);
        
        oscilador.connect(ganancia);
        ganancia.connect(contexto.destination);
        
        oscilador.start();
        
        setTimeout(() => {
            oscilador.stop();
        }, 1000);
    }

    function guardarContadorPomodoros() {
        // Guardar el contador con la fecha actual
        const hoy = new Date().toDateString();
        localStorage.setItem('ultimaFecha', hoy);
        localStorage.setItem('contadorPomodoros', contadorPomodoros);
    }

    function cargarContadorPomodoros() {
        const ultimaFecha = localStorage.getItem('ultimaFecha');
        const hoy = new Date().toDateString();
        
        // Si la última fecha guardada es hoy, cargar el contador
        if (ultimaFecha === hoy) {
            contadorPomodoros = parseInt(localStorage.getItem('contadorPomodoros')) || 0;
        } else {
            // Si es un nuevo día, reiniciar el contador
            contadorPomodoros = 0;
        }
        
        contadorElemento.textContent = contadorPomodoros;
    }

    // Inicializar el temporizador
    actualizarTiempo();
});
