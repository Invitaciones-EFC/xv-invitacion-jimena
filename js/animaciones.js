/* ==========================================================================
   Invitación XV Años · Jimena Nayeli
   ========================================================================== */

/* ═══════════════════════════════════════════════════════════════════════════
   ⬇⬇⬇  LO ÚNICO QUE HAY QUE CAMBIAR ESTÁ AQUÍ ABAJO  ⬇⬇⬇
   ═══════════════════════════════════════════════════════════════════════════ */

var CONFIG = {

  // Sábado 7 de noviembre de 2026, 6:00 PM (hora de la misa).
  // Los meses van de 0 a 11: noviembre = 10.
  fecha: new Date(2026, 10, 7, 18, 0),

  // 33 1364 0730  →  52 + los 10 dígitos, sin espacios ni guiones
  whatsapp: '523313640730',

  // Ruta de la canción. Mientras esté vacía, los botones de música no se
  // muestran. Ejemplo: 'musica/cancion.mp3'
  musica: ''

};

/* ═══════════════════════════════════════════════════════════════════════════
   ⬆⬆⬆  DE AQUÍ PARA ABAJO NO HACE FALTA TOCAR NADA  ⬆⬆⬆
   ═══════════════════════════════════════════════════════════════════════════ */


/* ---------------------------------------------- escribir la fecha en la página */
(function () {
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
               'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  var f = CONFIG.fecha;
  var dia = DIAS[f.getDay()];
  var Dia = dia.charAt(0).toUpperCase() + dia.slice(1);

  var formatos = {
    corta: Dia + ' · ' + f.getDate() + ' · ' + MESES[f.getMonth()] + ' · ' + f.getFullYear(),
    larga: Dia + ' ' + f.getDate() + ' de ' + MESES[f.getMonth()] + ' de ' + f.getFullYear()
  };

  Object.keys(formatos).forEach(function (clave) {
    document.querySelectorAll('[data-fecha="' + clave + '"]').forEach(function (el) {
      el.textContent = formatos[clave];
    });
  });
})();

/* ------------------------------------------------------------------ música */
(function () {
  var audio    = document.getElementById('audio-invitacion');
  var boton    = document.getElementById('btn-musica');
  var texto    = document.getElementById('btn-musica-texto');
  var flotante = document.getElementById('flotante');
  var portada  = document.querySelector('.hero');

  // Sin canción no se muestra ningún control
  if (!CONFIG.musica || !audio || !boton) return;

  audio.src = CONFIG.musica;
  audio.volume = 0.6;
  boton.hidden = false;
  if (flotante) flotante.hidden = false;

  var controles = [boton, flotante].filter(Boolean);

  function pintar(sonando) {
    controles.forEach(function (c) {
      c.classList.toggle('sonando', sonando);
      c.setAttribute('aria-pressed', sonando ? 'true' : 'false');
      c.setAttribute('aria-label', sonando ? 'Pausar la música' : 'Reproducir la música');
    });
    if (texto) texto.textContent = sonando ? 'Pausar' : 'Dale play';
  }

  controles.forEach(function (c) {
    c.addEventListener('click', function () {
      if (audio.paused) { audio.play(); } else { audio.pause(); }
    });
  });

  // El estado sigue al audio, no al clic: se corrige solo si el navegador
  // bloquea la reproducción o una llamada la interrumpe
  audio.addEventListener('play',  function () { pintar(true); });
  audio.addEventListener('pause', function () { pintar(false); });
  pintar(false);

  // El flotante entra al pasar el 45% de la portada
  if (!flotante || !portada) return;
  var visible = false, esperando = false;

  function revisar() {
    esperando = false;
    var pasada = window.scrollY > portada.offsetHeight * 0.45;
    if (pasada === visible) return;
    visible = pasada;
    flotante.classList.toggle('visible', pasada);
  }
  window.addEventListener('scroll', function () {
    if (esperando) return;
    esperando = true;
    requestAnimationFrame(revisar);
  }, { passive: true });
  window.addEventListener('resize', revisar, { passive: true });
  revisar();
})();

/* ------------------------------------------------ confirmar por WhatsApp --- */
(function () {
  var forma = document.getElementById('rsvp-form');
  if (!forma) return;

  var nombre = document.getElementById('rsvp-nombre');
  var asiste = document.getElementById('rsvp-asistencia');
  var error  = document.getElementById('rsvp-error');

  function avisar(mensaje, campo) {
    error.textContent = mensaje;
    error.hidden = false;
    campo.classList.add('mal');
    campo.focus();
  }
  function limpiar() {
    error.hidden = true;
    nombre.classList.remove('mal');
    asiste.classList.remove('mal');
  }

  nombre.addEventListener('input', limpiar);
  asiste.addEventListener('change', limpiar);

  forma.addEventListener('submit', function (evento) {
    evento.preventDefault();
    limpiar();

    var quien = nombre.value.trim().replace(/\s+/g, ' ');
    if (!quien)        { avisar('Escribe tu nombre para poder apartarte el lugar.', nombre); return; }
    if (!asiste.value) { avisar('Dinos si podrás acompañarnos.', asiste); return; }

    var texto = asiste.value === 'si'
      ? 'Hola, soy ' + quien + ' y confirmo con gusto mi asistencia a los XV años de Jimena Nayeli.'
      : 'Hola, soy ' + quien + '. Agradezco mucho la invitación a los XV años de Jimena Nayeli, pero lamentablemente no podré asistir.';

    // Misma pestaña: Safari en iPhone bloquea window.open fuera de un gesto directo
    window.location.href = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto);
  });
})();

/* --------------------------------------------------- aparición al bajar --- */
(function () {
  var elementos = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    elementos.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  // Aparece en cuanto el borde superior entra 60px en pantalla
  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('is-visible');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });

  elementos.forEach(function (el) { observador.observe(el); });
})();

/* ------------------------------------------------------- cuenta regresiva */
(function () {
  var destino = CONFIG.fecha.getTime();
  var grid  = document.getElementById('contador');
  var aviso = document.getElementById('contador-llego');
  if (!grid) return;

  var celdas = ['c-dias', 'c-horas', 'c-min', 'c-seg'].map(function (id) {
    return document.getElementById(id);
  });

  function dosDigitos(n) { return String(n).padStart(2, '0'); }

  function poner(el, valor) {
    if (el.textContent === valor) return;
    el.textContent = valor;
    el.classList.remove('late');
    void el.offsetWidth;          // reinicia la animación
    el.classList.add('late');
  }

  function actualizar() {
    var r = destino - Date.now();
    if (r <= 0) {
      grid.style.display = 'none';
      aviso.style.display = 'block';
      clearInterval(intervalo);
      return;
    }
    poner(celdas[0], dosDigitos(Math.floor(r / 86400000)));
    poner(celdas[1], dosDigitos(Math.floor((r % 86400000) / 3600000)));
    poner(celdas[2], dosDigitos(Math.floor((r % 3600000) / 60000)));
    poner(celdas[3], dosDigitos(Math.floor((r % 60000) / 1000)));
  }

  actualizar();
  var intervalo = setInterval(actualizar, 1000);
})();
