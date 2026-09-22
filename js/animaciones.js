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

  // Último día para confirmar. Se acepta todo ese día hasta la medianoche;
  // a partir del día siguiente el formulario ya no deja enviar.
  limite: new Date(2026, 9, 11, 23, 59, 59),

  // 33 1364 0730  →  52 + los 10 dígitos, sin espacios ni guiones
  whatsapp: '523313640730',

  // Ruta de la canción. Mientras esté vacía, los botones de música no se
  // muestran. Ejemplo: 'musica/cancion.mp3'
  musica: 'musica/cancion.mp3'

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
    completa: f.getDate() + ' de ' + MESES[f.getMonth()] + ' de ' + f.getFullYear(),
    limite: CONFIG.limite.getDate() + ' de ' + MESES[CONFIG.limite.getMonth()],
    larga: Dia + ' ' + f.getDate() + ' de ' + MESES[f.getMonth()] + ' de ' + f.getFullYear()
  };

  Object.keys(formatos).forEach(function (clave) {
    document.querySelectorAll('[data-fecha="' + clave + '"]').forEach(function (el) {
      el.textContent = formatos[clave];
    });
  });

  // Portada: "7 · noviembre · 2026", con cada punto en su propio span para
  // pintarlo en dorado y darle aire a los lados
  var partes = [String(f.getDate()), MESES[f.getMonth()], String(f.getFullYear())];
  document.querySelectorAll('[data-fecha="corta"]').forEach(function (el) {
    el.textContent = '';
    el.setAttribute('aria-label', f.getDate() + ' de ' + MESES[f.getMonth()] + ' de ' + f.getFullYear());
    partes.forEach(function (texto, i) {
      if (i) {
        var punto = document.createElement('span');
        punto.className = 'punto';
        punto.setAttribute('aria-hidden', 'true');
        punto.textContent = '·';
        el.appendChild(punto);
      }
      el.appendChild(document.createTextNode(texto));
    });
  });
})();

/* ------------------------------------------------ bienvenida: abrir la invitación
   El toque en "Abrir invitación" hace tres cosas a la vez: arranca la música
   (el celular solo deja sonar audio si viene de un toque), abre las hojas y
   dispara la entrada de la portada. */
(function () {
  var portal = document.getElementById('portal');
  var boton  = document.getElementById('portal-btn');
  var audio  = document.getElementById('audio-invitacion');
  if (!portal || !boton) { document.body.classList.remove('cerrada'); return; }

  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  boton.addEventListener('click', function () {
    boton.disabled = true;

    // La canción ya la cargó el bloque de música; aquí solo se le da play
    if (CONFIG.musica && audio && audio.getAttribute('src')) {
      var intento = audio.play();
      if (intento && intento.catch) intento.catch(function () {});
    }

    portal.classList.add('abriendo');
    document.body.classList.remove('cerrada');
    document.body.classList.add('abierta');

    // Se quita del todo cuando las hojas terminan de abrirse
    setTimeout(function () { portal.remove(); }, reducido ? 450 : 1600);
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

  var asiste = document.getElementById('rsvp-asistencia');
  var error  = document.getElementById('rsvp-error');
  var boton  = forma.querySelector('button[type="submit"]');
  var plazo  = document.querySelector('.rsvp-plazo');
  var nota   = document.getElementById('rsvp-nota');

  function cerrado() { return Date.now() > CONFIG.limite.getTime(); }

  // Pasada la fecha límite el formulario se cierra: no se puede enviar nada más
  if (cerrado()) {
    asiste.disabled = true;
    boton.disabled = true;
    forma.classList.add('cerrado');
    if (plazo) plazo.hidden = true;
    if (nota) {
      nota.textContent = 'El plazo para confirmar ya terminó. Si aún deseas ' +
                         'avisarnos, comunícate directamente por WhatsApp.';
      nota.classList.add('rsvp-nota--cerrada');
    }
  }

  function avisar(mensaje, campo) {
    error.textContent = mensaje;
    error.hidden = false;
    campo.classList.add('mal');
    campo.focus();
  }
  function limpiar() {
    error.hidden = true;
    asiste.classList.remove('mal');
  }

  asiste.addEventListener('change', limpiar);

  // El guardia va siempre, incluso con el plazo vencido: si no, el navegador
  // enviaría el formulario por su cuenta y recargaría la página
  forma.addEventListener('submit', function (evento) {
    evento.preventDefault();
    limpiar();

    // Se revisa aquí también por si la pestaña quedó abierta desde antes
    if (cerrado()) {
      avisar('El plazo para confirmar ya terminó.', asiste);
      return;
    }

    if (!asiste.value) { avisar('Dinos si podrás acompañarnos.', asiste); return; }

    var texto = asiste.value === 'si'
      ? 'Hola, confirmo con gusto mi asistencia a los XV años de Jimena Nayeli.'
      : 'Hola, agradezco mucho la invitación a los XV años de Jimena Nayeli, pero lamentablemente no podré asistir.';

    // Misma pestaña: Safari en iPhone bloquea window.open fuera de un gesto directo
    window.location.href = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto);
  });
})();

/* --------------------------------------------------- aparición al bajar --- */
(function () {
  // Cada hijo de una sección .reveal recibe su turno en --i, y el CSS lo
  // convierte en retraso: así entran en cascada y no todos de golpe
  var bloques = document.querySelectorAll('.reveal');
  bloques.forEach(function (bloque) {
    Array.prototype.forEach.call(bloque.children, function (hijo, i) {
      hijo.style.setProperty('--i', i);
    });
  });

  // Las tarjetas se observan aparte: la segunda está mucho más abajo y su
  // foto debe destaparse cuando llegue a ella, no cuando entra la sección
  var elementos = document.querySelectorAll('.reveal, .tarjeta');

  if (!('IntersectionObserver' in window)) {
    elementos.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('is-visible');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -70px 0px' });

  elementos.forEach(function (el) { observador.observe(el); });
})();
