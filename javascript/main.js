// Clase "molde" para los productos de nuestra aplicación
class Producto {
    constructor(id, nombre, precio, categoria, imagen) {
      this.id = id;
      this.nombre = nombre;
      this.precio = precio;
      this.categoria = categoria;
      this.imagen = imagen;
    }
  }
  
  // Clase para que simula la base de datos del e-commerce, acá van a estar
  // todos los productos de nuestro catálogo
  class BaseDeDatos {
    constructor() {
      // Array para el catálogo
      this.productos = [];
      // Empezar a cargar productos
      this.agregarRegistro(1, "Alma Negra Blend", 7840, "Vinos", "../images/botella_alma_negra.jpg");
      this.agregarRegistro(2, "D.V Catena Malbec", 7250, "Vinos", "../images/botella_catena_zapata.jpg");
      this.agregarRegistro(3, "Luigi Bosca Malbec", 5100, "Vinos", "../images/botella_luigi_bosca.jpg");
      this.agregarRegistro(4, "Nicasia Malbec", 3500, "Vinos", "../images/botella_nicasia.jpg");
      this.agregarRegistro(5, "Piattelli Arlene", 11420, "Vinos", "../images/botella_piattelli_arlene.jpg");
      this.agregarRegistro(6, "Piattelli Torrontes", 2800, "Vinos", "../images/botella_piattelli_torrontes.jpg");
      this.agregarRegistro(7, "Rutini Malbec", 8550, "Vinos", "../images/botella_rutini.jpg");
      this.agregarRegistro(8, "Salentein Malbec", 3450, "Vinos", "../images/botella_salentein.jpg");     
    }
    // Método que crea el objeto producto y lo almacena en el catálogo (array)
    agregarRegistro(id, nombre, precio, categoria, imagen) {
      const producto = new Producto(id, nombre, precio, categoria, imagen);
      this.productos.push(producto);
    }
  
    // Nos devuelve todo el catálogo de productos
    traerRegistros() {
      return this.productos;
    }
  
    // Nos devuelve un producto según el ID
    registroPorId(id) {
      return this.productos.find((producto) => producto.id === id);
    }
    // Nos devuelve un array con todas las coincidencias que encuentre según el
    // nombre del producto con la palabra que el pasemos como parámetro
    registrosPorNombre(palabra) {
      return this.productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(palabra.toLowerCase())
      );
    }
  }
  
  // Clase carrito que nos sirve para manipular los productos de nuestro carrito
  class Carrito {
    constructor() {
      // Storage
      const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
      // Array donde van a estar almacenados todos los productos del carrito
      this.carrito = carritoStorage || [];
      this.total = 0; // Suma total de los precios de todos los productos
      this.cantidadProductos = 0; // La cantidad de productos que tenemos en el carrito
      // Llamo a listar apenas de instancia el carrito para aplicar lo que
      // hay en el storage (en caso de que haya algo)
      this.listar();
    }
  
    // Método para saber si el producto ya se encuentra en el carrito
    estaEnCarrito({ id }) {
      return this.carrito.find((producto) => producto.id === id);
    }
  
    // Agregar al carrito
    agregar(producto) {
      const productoEnCarrito = this.estaEnCarrito(producto);
      // Si no está en el carrito, le mando eun push y le agrego
      // la propiedad "cantidad"
      if (!productoEnCarrito) {
        this.carrito.push({ ...producto, cantidad: 1 });
      } else {
        // De lo contrario, si ya está en el carrito, le sumo en 1 la cantidad
        productoEnCarrito.cantidad++;
      }
      // Actualizo el storage
      localStorage.setItem("carrito", JSON.stringify(this.carrito));
      // Muestro los productos en el HTML
      this.listar();
    }
  
    // Quitar del carrito
    quitar(id) {
      // Obento el índice de un producto según el ID, porque el
      // método splice requiere el índice
      const indice = this.carrito.findIndex((producto) => producto.id === id);
      // Si la cantidad es mayor a 1, le resto la cantidad en 1
      if (this.carrito[indice].cantidad > 1) {
        this.carrito[indice].cantidad--;
      } else {
        // Y sino, borramos del carrito el producto a quitar
        this.carrito.splice(indice, 1);
      }
      // Actualizo el storage
      localStorage.setItem("carrito", JSON.stringify(this.carrito));
      // Muestro los productos en el HTML
      this.listar();
    }
  
    // Renderiza todos los productos en el HTML
    listar() {
      // Reiniciamos variables
      this.total = 0;
      this.cantidadProductos = 0;
      divCarrito.innerHTML = "";
      // Recorro producto por producto del carrito, y los dibujo en el HTML
      for (const producto of this.carrito) {
        divCarrito.innerHTML += `
          <div class="productoCarrito">
            <h5>${producto.nombre}</h5>
            <p>$${producto.precio}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <button href="#" class="btnQuitar" data-id="${producto.id}">Quitar del carrito</button>            
            </div>
        `;
        // Actualizamos los totales
        this.total += producto.precio * producto.cantidad;
        this.cantidadProductos += producto.cantidad;
      }
      
      // Como no se cuantos productos tengo en el carrito, debo
      // asignarle los eventos de forma dinámica a cada uno
      // Primero hago una lista de todos los botones con .querySelectorAll
      const botonesQuitar = document.querySelectorAll(".btnQuitar");
      // Después los recorro uno por uno y les asigno el evento a cada uno
      for (const boton of botonesQuitar) {
        boton.addEventListener("click", (event) => {
          event.preventDefault();
          // Obtengo el id por el dataset (está asignado en this.listar())
          const idProducto = Number(boton.dataset.id);
          // Llamo al método quitar pasándole el ID del producto
          this.quitar(idProducto);
        });
      }
      // Actualizo los contadores del HTML
      spanCantidadProductos.innerText = this.cantidadProductos;
      spanTotalCarrito.innerText = this.total;
    }
  }
  
  // Instanciamos la base de datos
  const bd = new BaseDeDatos();
  
  // Elementos
  const spanCantidadProductos = document.querySelector("#cantidadProductos");
  const spanTotalCarrito = document.querySelector("#totalCarrito");
  const divProductos = document.querySelector("#productos");
  const divCarrito = document.querySelector("#carrito");
  const inputBuscar = document.querySelector("#inputBuscar");
  const botonCarrito = document.querySelector("section h1");
  
  // Instaciamos la clase Carrito
  const carrito = new Carrito();
  
  // Mostramos el catálogo de la base de datos apenas carga la página
  cargarProductos(bd.traerRegistros());
  
  // Función para mostrar para renderizar productos del catálogo o buscador
  function cargarProductos(productos) {
    // Vacíamos el div
    divProductos.innerHTML = "";
    // Recorremos producto por producto y lo dibujamos en el HTML
    for (const producto of productos) {
      divProductos.innerHTML += `
        <div class="producto card">
          <div class="imagen">
            <img src="img/${producto.imagen}" />
          </div>
          <h5>${producto.nombre.toUpperCase()}</h5>
          <p class="precio">$${producto.precio}</p>
          <div tabindex="0" class="btnAgregar" data-id="${producto.id}" class="plusButton">
          <svg class="plusIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
            <g mask="url(#mask0_21_345)">
              <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
            </g>
          </svg>
        </div>
          </div>
      `;
    }
  
    // Lista dinámica con todos los botones que haya en nuestro catálogo
    const botonesAgregar = document.querySelectorAll(".btnAgregar");
  
    // Recorremos botón por botón de cada producto en el catálogo y le agregamos
    // el evento click a cada uno
    for (const boton of botonesAgregar) {
      boton.addEventListener("click", (event) => {
        // Evita el comportamiento default de HTML
        event.preventDefault();
        // Guardo el dataset ID que está en el HTML del botón Agregar al carrito
        const idProducto = Number(boton.dataset.id);
        // Uso el método de la base de datos para ubicar el producto según el ID
        const producto = bd.registroPorId(idProducto);
        // Llama al método agregar del carrito
        carrito.agregar(producto);
      });
    }
  }
  
  // Buscador
  inputBuscar.addEventListener("input", (event) => {
    event.preventDefault();
    const palabra = inputBuscar.value;
    const buscador = bd.registrosPorNombre(palabra);
    cargarProductos(buscador);
  });
// Toggle para ocultar/mostrar el carrito
botonCarrito.addEventListener("click", (event) => {
  document.querySelector("section").classList.toggle("ocultar");
});