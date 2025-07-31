window.addEventListener('DOMContentLoaded', () => {
  // --- Lógica del modal de bienvenida ---
  const modal = document.getElementById('welcome-modal');
  const startBtn = document.getElementById('start-game-btn');
  const homeBtn = document.getElementById('go-home-btn');
  if (modal) {
    document.body.style.overflow = 'hidden';
    modal.style.display = 'flex';
    document.querySelectorAll('.side-panel, #zoom-controls, #timer-container').forEach(el => {
      el.style.filter = 'blur(2px)';
      el.style.pointerEvents = 'none';
    });
    document.getElementById('viewport').style.filter = 'blur(2px)';
    document.getElementById('viewport').style.pointerEvents = 'none';
  }
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (modal) modal.style.display = 'none';
      document.body.style.overflow = '';
      document.querySelectorAll('.side-panel, #zoom-controls, #timer-container').forEach(el => {
        el.style.filter = '';
        el.style.pointerEvents = '';
      });
      document.getElementById('viewport').style.filter = '';
      document.getElementById('viewport').style.pointerEvents = '';
    });
  }
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      window.location.href = '../index.html';
    });
  }

  // --- Variables globales del juego ---
  let totalSeconds = 120;
  let gameEnded = false;
  let puntaje = 0;
  let timerInterval;
  let balance = { cables: 0, charcos: 0, extintores: 0 };
  const timerMinutes = document.getElementById('timer-minutes');
  const timerSeconds = document.getElementById('timer-seconds');
  // const sfx = document.getElementById('sfx-correcto'); // Eliminada duplicada

  // --- Temporizador ---
  function updateTimer() {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    timerMinutes.textContent = min.toString().padStart(2, '0');
    timerSeconds.textContent = sec.toString().padStart(2, '0');
  }
  updateTimer();
  timerInterval = setInterval(() => {
    if (totalSeconds > 0 && !gameEnded) {
      totalSeconds--;
      updateTimer();
    } else if (!gameEnded) {
      clearInterval(timerInterval);
      gameEnded = true;
      mostrarEndgameModal(true);
    }
  }, 1000);

  // --- Mostrar balance y explicación ---
  function mostrarEndgameModal(tiempoFinalizado = false) {
    const modal = document.getElementById('endgame-modal');
    const balanceDiv = document.getElementById('endgame-balance');
    const explanationDiv = document.getElementById('endgame-explanation');
    if (modal && balanceDiv && explanationDiv) {
      balanceDiv.innerHTML = `
        <h3>Balance de hallazgos:</h3>
        <ul>
          <li><b>Cables sueltos corregidos:</b> ${balance.cables} / 7</li>
          <li><b>Charcos señalizados:</b> ${balance.charcos} / 5</li>
          <li><b>Extintores colocados:</b> ${balance.extintores} / 11</li>
        </ul>
      `;
      explanationDiv.innerHTML = `
        <h3>¿Por qué son riesgos laborales?</h3>
        <ul>
          <li><b>Cables sueltos:</b> Son un peligro de tropiezo y pueden causar caídas, lesiones o incluso electrocución si están energizados.</li>
          <li><b>Charcos de agua:</b> Aumentan el riesgo de resbalones y caídas, y pueden provocar descargas eléctricas si hay equipos eléctricos cerca.</li>
          <li><b>Falta de extintores:</b> No contar con extintores accesibles impide una respuesta rápida ante incendios, poniendo en riesgo la vida y la integridad de los trabajadores.</li>
        </ul>
        <p>${tiempoFinalizado ? 'El tiempo ha terminado. ¡Sigue practicando para identificar todos los riesgos!' : '¡Felicidades por identificar y corregir los riesgos laborales!'}</p>
      `;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      document.querySelectorAll('.side-panel, #zoom-controls, #timer-container').forEach(el => {
        el.style.filter = 'blur(2px)';
        el.style.pointerEvents = 'none';
      });
      document.getElementById('viewport').style.filter = 'blur(2px)';
      document.getElementById('viewport').style.pointerEvents = 'none';
      gameEnded = true;
    }
  }

  function checkEndGame() {
    if (!gameEnded && puntaje >= 23) {
      gameEnded = true;
      clearInterval(timerInterval);
      document.querySelectorAll('.side-panel, #zoom-controls, #timer-container').forEach(el => {
        el.style.filter = 'blur(2px)';
        el.style.pointerEvents = 'none';
      });
      document.getElementById('viewport').style.filter = 'blur(2px)';
      document.getElementById('viewport').style.pointerEvents = 'none';
      mostrarEndgameModal(false);
    }
  }

  // --- Funcionalidad de Zoom ---
  let zoomLevel = 1;
  const minZoom = 0.5;
  const maxZoom = 2.5;
  const zoomStep = 0.15;
  // --- 7 Sprites Cables interactivos ---
  // Puedes modificar top, left y width de cada objeto para personalizar la posición y tamaño
  const cablesData = [
    { src: 'sprites/CableCeleste1.png', top: '480px', left: '878px', width: '32px' },
    { src: 'sprites/CableAzul2.png', top: '660px', left: '402px', width: '32px' },
    { src: 'sprites/CableNegro3.png', top: '496px', left: '296px', width: '32px' },
    { src: 'sprites/CableNegroReversa4.png', top: '350px', left: '187px', width: '32px' },
    { src: 'sprites/CableCelesteLargo5.png', top: '210px', left: '393px', width: '64px' },
    { src: 'sprites/CableBlanco6.png', top: '338px', left: '604px', width: '108px' },
    { src: 'sprites/CableVerde7.png', top: '250px', left: '80px', width: '32px' },
  ];

  const sfx = document.getElementById('sfx-correcto');
  // --- Balance de hallazgos ---

  cablesData.forEach((data, idx) => {
    const cable = document.createElement('img');
    cable.src = data.src;
    cable.id = `cable-${idx+1}`;
    cable.className = 'sprite sprite-cable';
    cable.style.top = data.top;
    cable.style.left = data.left;
    cable.style.width = data.width;
    cable.style.position = 'absolute';
    cable.style.cursor = 'pointer';
    cable.style.zIndex = 5;

    let cableMarcado = false;
    cable.addEventListener('click', () => {
      if (cableMarcado) return;
      cable.style.opacity = 0.4;
      cableMarcado = true;
      // Sumar 1 punto
      puntaje += 1;
      balance.cables += 1;
      document.getElementById('score').textContent = `Puntaje: ${puntaje}`;
      if (sfx) { sfx.currentTime = 0; sfx.play(); }
      checkEndGame();
    });

    document.getElementById('game-container').appendChild(cable);
  });
  // --- Fin 7 sprites Cables ---
  // --- 5 Sprites Charco interactivos ---
  // Puedes modificar top, left y width de cada objeto para personalizar la posición y tamaño
  const charcosData = [
    { top: '400px', left: '400px', width: '32px' },
    { top: '565px', left: '600px', width: '32px' },
    { top: '300px', left: '800px', width: '32px' },
    { top: '600px', left: '200px', width: '32px' },
    { top: '700px', left: '610px', width: '32px' },
  ];

  charcosData.forEach((data, idx) => {
    const charco = document.createElement('img');
    charco.src = 'sprites/Charco.png';
    charco.id = `charco-${idx+1}`;
    charco.className = 'sprite sprite-charco';
    charco.style.top = data.top;
    charco.style.left = data.left;
    charco.style.width = data.width;
    charco.style.position = 'absolute';
    charco.style.cursor = 'pointer';
    charco.style.zIndex = 5;

    let senalPisoAgregada = false;
    charco.addEventListener('click', () => {
      if (senalPisoAgregada) return;
      const senal = document.createElement('img');
      senal.src = 'sprites/SeñalPiso.png';
      senal.id = `senal-piso-${idx+1}`;
      senal.className = 'sprite';
      senal.style.top = data.top;
      senal.style.left = data.left;
      senal.style.width = data.width;
      senal.style.position = 'absolute';
      senal.style.zIndex = 6;
      document.getElementById('game-container').appendChild(senal);
      senalPisoAgregada = true;
      // Sumar 1 punto
      puntaje += 1;
      balance.charcos += 1;
      document.getElementById('score').textContent = `Puntaje: ${puntaje}`;
      if (sfx) { sfx.currentTime = 0; sfx.play(); }
      checkEndGame();
    });

    document.getElementById('game-container').appendChild(charco);
  });
  // --- Fin 5 sprites Charco ---
  // --- 11 Sprites CuadradoExtintor interactivos ---
  const extintoresData = [
    { top: '219px', left: '440px', width: '16px' },// 1er extintor al lado de la puerta de cristal
    { top: '277px', left: '190px', width: '16px' },// 2do extintor pegado a la pared
    { top: '377px', left: '538px', width: '16px' },// 3er extintor al lado del pasillo
    { top: '377px', left: '883px', width: '16px' },// 4to extintor al lado del pasillo mas al fondo
    { top: '417px', left: '160px', width: '16px' },// 5to extintor al lado de la pared de la entrada izquierda
    { top: '713px', left: '548px', width: '16px' },// 6to extintor de la primera oficina de abajo 
    { top: '602px', left: '326px', width: '16px' },// 7mo extintor antes de entrar a la primera oficina de abajo
    { top: '688px', left: '577px', width: '16px' },// 8vo extintor de la segunda oficina de abajo
    { top: '575px', left: '982px', width: '16px' },// 9no extintor al lado de la pared de la oficina derecha del fondo
    { top: '612px', left: '131px', width: '16px' },// 10mo extintor del fondo de la parte izquieda antes de entrar a las oficinas
    { top: '471px', left: '301px', width: '16px' },// 11mo extintor al lado de los muebles azules
  ];

  extintoresData.forEach((data, idx) => {
    const cuadradoExtintor = document.createElement('img');
    cuadradoExtintor.src = 'sprites/CuadradoExtintor.png';
    cuadradoExtintor.id = `cuadrado-extintor-${idx+1}`;
    cuadradoExtintor.className = 'sprite sprite-neon';
    cuadradoExtintor.style.top = data.top;
    cuadradoExtintor.style.left = data.left;
    cuadradoExtintor.style.width = data.width;
    cuadradoExtintor.style.position = 'absolute';
    cuadradoExtintor.style.cursor = 'pointer';
    cuadradoExtintor.style.zIndex = 5;

    cuadradoExtintor.addEventListener('click', () => {
      // Reemplazar por el extintor real
      const extintor = document.createElement('img');
      extintor.src = 'sprites/Extintor.png';
      extintor.id = `extintor-final-${idx+1}`;
      extintor.className = 'sprite';
      extintor.style.top = data.top;
      extintor.style.left = data.left;
      extintor.style.width = data.width;
      extintor.style.position = 'absolute';
      extintor.style.zIndex = 5;
      cuadradoExtintor.remove();
      document.getElementById('game-container').appendChild(extintor);
      // Sumar 1 punto
      puntaje += 1;
      balance.extintores += 1;
      document.getElementById('score').textContent = `Puntaje: ${puntaje}`;
      if (sfx) { sfx.currentTime = 0; sfx.play(); }
      checkEndGame();
    });

  // --- Botones del modal de finalización ---
  const restartBtn = document.getElementById('restart-btn');
  const goHomeBtnEnd = document.getElementById('go-home-btn-end');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      window.location.reload();
    });
  }
  if (goHomeBtnEnd) {
    goHomeBtnEnd.addEventListener('click', () => {
      window.location.href = '../index.html';
    });
  }

    document.getElementById('game-container').appendChild(cuadradoExtintor);
  });
  // --- Fin 11 sprites CuadradoExtintor ---
  // --- Drag para mover el juego con zoom ---
  const viewport = document.getElementById('viewport');
  let isDragging = false;
  let startX, startY, lastX = 0, lastY = 0;

  function setTransform() {
    gameContainer.style.transform = `scale(${zoomLevel}) translate(${lastX / zoomLevel}px, ${lastY / zoomLevel}px)`;
    gameContainer.style.transformOrigin = 'center center';
  }

  function onPointerDown(e) {
    if (zoomLevel <= 1) return;
    isDragging = true;
    viewport.classList.add('dragging');
    startX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    startY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
  }
  function onPointerMove(e) {
    if (!isDragging) return;
    const x = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const y = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
    lastX += x - startX;
    lastY += y - startY;
    startX = x;
    startY = y;
    setTransform();
  }
  function onPointerUp() {
    isDragging = false;
    viewport.classList.remove('dragging');
  }

  viewport.addEventListener('mousedown', onPointerDown);
  viewport.addEventListener('mousemove', onPointerMove);
  viewport.addEventListener('mouseup', onPointerUp);
  viewport.addEventListener('mouseleave', onPointerUp);
  viewport.addEventListener('touchstart', onPointerDown, { passive: false });
  viewport.addEventListener('touchmove', onPointerMove, { passive: false });
  viewport.addEventListener('touchend', onPointerUp);

  // Actualizar zoom y drag juntos
  function updateZoomAndDrag() {
    setTransform();
  }

  // Sobrescribir updateZoom para que use updateZoomAndDrag
  updateZoom = updateZoomAndDrag;
  // --- Fin drag ---
  const gameContainer = document.getElementById('game-container');
  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');



  if (zoomInBtn && zoomOutBtn) {
    zoomInBtn.addEventListener('click', () => {
      if (zoomLevel < maxZoom) {
        zoomLevel += zoomStep;
        updateZoom();
      }
    });
    zoomOutBtn.addEventListener('click', () => {
      if (zoomLevel > minZoom) {
        zoomLevel -= zoomStep;
        updateZoom();
      }
    });
  }
});
// --- Fin funcionalidad de Zoom ---
const riesgos = {
  cable1: { corregido: false },
  cable2: { corregido: false },
  cable3: { corregido: false },
  charco: { corregido: false },
  extintor: { corregido: false },
  senal: { corregido: false },
};

let puntaje = 0;

document.querySelectorAll('.sprite').forEach(sprite => {
  sprite.addEventListener('click', () => {
    const id = sprite.id;
    if (!riesgos[id].corregido) {
      riesgos[id].corregido = true;
      sprite.style.opacity = 0.3;
      puntaje += 10;
      document.getElementById('score').textContent = `Puntaje: ${puntaje}`;
      alert(`¡Bien hecho! Has corregido un riesgo: ${id}`);
    }
  });
});
