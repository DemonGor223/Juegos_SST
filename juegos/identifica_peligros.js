// --- Funcionalidad de Zoom ---
let zoomLevel = 1;
const minZoom = 0.5;
const maxZoom = 2.5;
const zoomStep = 0.15;

window.addEventListener('DOMContentLoaded', () => {
  // --- 11 Sprites CuadradoExtintor interactivos ---
  // Puedes modificar top, left y width de cada objeto para personalizar la posición y tamaño
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
      document.getElementById('score').textContent = `Puntaje: ${puntaje}`;
    });

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
