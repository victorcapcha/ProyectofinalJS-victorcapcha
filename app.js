const SELECTOR_CARRITO = '#carrito';
const SELECTOR_ELEMENTOS_1 = '#lista-1';
const SELECTOR_ELEMENTOS_2 = '#lista-2';
const SELECTOR_VACIAR_CARRITO = '#vaciar-carrito';
const ATRIBUTO_DATA_ID = 'data-id';

const carrito = document.querySelector(SELECTOR_CARRITO);
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector(SELECTOR_VACIAR_CARRITO);
let carritoItems = [];

document.addEventListener('DOMContentLoaded', () => {
  cargarEventListeners();
  cargarCarritoDesdeLocalStorage();
  cargarCarritoDesdeJSON();
});

function cargarEventListeners() {
  carrito.addEventListener('click', (e) => {
    if (e.target.classList.contains('borrar')) {
      eliminarElemento(e.target.getAttribute(ATRIBUTO_DATA_ID));
    } else if (e.target.classList.contains('agregar')) {
      agregarCantidad(e.target.getAttribute(ATRIBUTO_DATA_ID));
    } else if (e.target.classList.contains('quitar')) {
      quitarCantidad(e.target.getAttribute(ATRIBUTO_DATA_ID));
    }
  });

  vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

  const elementos1 = document.querySelector(SELECTOR_ELEMENTOS_1);
  const elementos2 = document.querySelector(SELECTOR_ELEMENTOS_2);

  elementos1.addEventListener('click', comprarElemento);
  elementos2.addEventListener('click', comprarElemento);

  const formularioCompra = document.getElementById('datos-compra');
  formularioCompra.addEventListener('submit', finalizarCompra);
}

function comprarElemento(e) {
  e.preventDefault();
  if (e.target.classList.contains('agregar-carrito')) {
    const elemento = e.target.parentElement.parentElement;
    const infoElemento = leerDatosElemento(elemento);
    insertarCarrito(infoElemento);
    guardarCarritoLocalStorage();
  }
}

function leerDatosElemento(elemento) {
  return {
    imagen: elemento.querySelector('img').src,
    titulo: elemento.querySelector('h3').textContent,
    precio: elemento.querySelector('.precio').textContent,
    id: elemento.querySelector('a').getAttribute(ATRIBUTO_DATA_ID),
    cantidad: 1,
  };
}

function insertarCarrito(elemento) {
  const elementoExistente = carritoItems.find((item) => item.id === elemento.id);

  if (elementoExistente) {
    elementoExistente.cantidad++;
  } else {
    carritoItems.push(elemento);
  }

  actualizarCarrito();
  guardarCarritoLocalStorage();
}

function eliminarElemento(id) {
  const indice = carritoItems.findIndex((item) => item.id === id);

  if (indice !== -1) {
    carritoItems.splice(indice, 1);
    actualizarCarrito();
    guardarCarritoLocalStorage();
  }
}

function agregarCantidad(id) {
  const elemento = carritoItems.find((item) => item.id === id);

  if (elemento) {
    elemento.cantidad++;
    actualizarCarrito();
    guardarCarritoLocalStorage();
  }
}

function quitarCantidad(id) {
  const elemento = carritoItems.find((item) => item.id === id);

  if (elemento && elemento.cantidad > 1) {
    elemento.cantidad--;
    actualizarCarrito();
    guardarCarritoLocalStorage();
  }
}

function vaciarCarrito() {
  carritoItems = [];
  actualizarCarrito();
  guardarCarritoLocalStorage();
}

function actualizarCarrito() {
  lista.innerHTML = '';

  carritoItems.forEach((elemento) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <img src="${elemento.imagen}" width="100">
      </td>
      <td>
        ${elemento.titulo}
      </td>
      <td>
        ${elemento.precio}
      </td>
      <td>
        <button class="quitar" data-id="${elemento.id}">-</button>
        <span>${elemento.cantidad}</span>
        <button class="agregar" data-id="${elemento.id}">+</button>
      </td>
      <td>
        <a href="#" class="borrar" data-id="${elemento.id}">X</a>
      </td>
    `;
    lista.appendChild(row);
  });

  const botonesAgregar = document.querySelectorAll('.agregar');
  const botonesQuitar = document.querySelectorAll('.quitar');

  botonesAgregar.forEach((boton) => {
    boton.addEventListener('click', () => agregarCantidad(boton.getAttribute(ATRIBUTO_DATA_ID)));
  });

  botonesQuitar.forEach((boton) => {
    boton.addEventListener('click', () => quitarCantidad(boton.getAttribute(ATRIBUTO_DATA_ID)));
  });
}

function guardarCarritoLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carritoItems));
}

function cargarCarritoDesdeLocalStorage() {
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado && carritoItems.length === 0) {
    carritoItems = JSON.parse(carritoGuardado);
    actualizarCarrito();
  }
}

function cargarCarritoDesdeJSON() {
  fetch('productos.json')
    then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    then((data) => {
      carritoItems = data;
      actualizarCarrito();
    })
    .catch((error) => {
      console.error('Error al cargar los datos desde el JSON:', error);
    });
}

function finalizarCompra(e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const direccion = document.getElementById('direccion').value;
  const telefono = document.getElementById('telefono').value;

  if (!nombre || !direccion || !telefono) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  vaciarCarrito();
  const formularioCompra = document.getElementById('datos-compra');
  formularioCompra.style.display = 'none';
  const mensajeCompra = document.getElementById('mensaje-compra');
  mensajeCompra.style.display = 'block';
}
