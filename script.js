function mostrarContenido(seccion) {
  document.querySelectorAll('main section').forEach(sec => {
    sec.classList.remove('activo');
  });
  document.getElementById(seccion).classList.add('activo');
  
  // Manejar botones activos
  document.getElementById("btn-juegos").classList.remove('active');
  document.getElementById("btn-info").classList.remove('active');
  if(seccion === "juegos") document.getElementById("btn-juegos").classList.add('active');
  if(seccion === "info") document.getElementById("btn-info").classList.add('active');
}

function empezarJuego(nombre) {
  document.getElementById('modal-juego').style.display = 'block';
  document.getElementById('nombre-juego').textContent = nombre;
}

function cerrarModal() {
  document.getElementById('modal-juego').style.display = 'none';
}

// Cerrar modal al hacer clic fuera del contenido
window.onclick = function(event) {
  const modal = document.getElementById('modal-juego');
  if (event.target == modal) {
    cerrarModal();
  }
};
