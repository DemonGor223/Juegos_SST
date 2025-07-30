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
