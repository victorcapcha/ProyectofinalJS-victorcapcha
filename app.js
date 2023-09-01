const SELECTOR_CARRITO = '#carrito';
const SELECTOR_ELEMENTOS_1 = '#lista-1';
const SELECTOR_ELEMENTOS_2 = '#lista-2';
const SELECTOR_VACIAR_CARRITO = '#vaciar-carrito';
const ATRIBUTO_DATA_ID = 'data-id';

const carrito = document.querySelector(SELECTOR_CARRITO);
const elementos1 = document.querySelector(SELECTOR_ELEMENTOS_1);
const elementos2 = document.querySelector(SELECTOR_ELEMENTOS_2);
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector(SELECTOR_VACIAR_CARRITO);
let carritoItems = [];

cargarEventListeners();

function cargarEventListeners() {
  elementos1.addEventListener('click', comprarElemento);
  elementos2.addEventListener('click', comprarElemento);
  lista.addEventListener('click', eliminarElemento);
  vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
  document.addEventListener('DOMContentLoaded', cargarCarritoLocalStorage);
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
      cantidad: 1
  };
}


function insertarCarrito(elemento) {
  const elementoExistente = carritoItems.find(item => item.id === elemento.id);

  if (elementoExistente) {
      elementoExistente.cantidad++;
  } else {
      carritoItems.push(elemento);
  }

  actualizarCarrito();
  guardarCarritoLocalStorage();
}

function eliminarElemento(e) {
  e.preventDefault();
  if (e.target.classList.contains('borrar')) {
    const elementoId = e.target.getAttribute(ATRIBUTO_DATA_ID);
    const indice = carritoItems.findIndex(item => item.id === elementoId);

    if (indice !== -1) {
      carritoItems.splice(indice, 1);
      actualizarCarrito();
      guardarCarritoLocalStorage();
    }
  }
}

function agregarCantidad(e) {
  const elementoId = e.target.getAttribute(ATRIBUTO_DATA_ID);
  const elemento = carritoItems.find(item => item.id === elementoId);

  if (elemento) {
      elemento.cantidad++;
      actualizarCarrito();
      guardarCarritoLocalStorage();
  }
}

function quitarCantidad(e) {
  const elementoId = e.target.getAttribute(ATRIBUTO_DATA_ID);
  const elemento = carritoItems.find(item => item.id === elementoId);

  if (elemento) {
      if (elemento.cantidad > 1) {
          elemento.cantidad--;
          actualizarCarrito();
          guardarCarritoLocalStorage();
      }
  }
}

function vaciarCarrito() {
  carritoItems = [];
  actualizarCarrito();
  guardarCarritoLocalStorage();
}

function actualizarCarrito() {
  lista.innerHTML = '';

  carritoItems.forEach(elemento => {
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

  botonesAgregar.forEach(boton => {
      boton.addEventListener('click', agregarCantidad);
  });

  botonesQuitar.forEach(boton => {
      boton.addEventListener('click', quitarCantidad);
  });
}



function guardarCarritoLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carritoItems));
}

function cargarCarritoLocalStorage() {
  const carritoLocalStorage = JSON.parse(localStorage.getItem('carrito'));

  if (carritoLocalStorage) {
    carritoItems = carritoLocalStorage;
    actualizarCarrito();
  }
}


