fetch("/js/productos-local.json")
  .then((response) => response.json())
  .then((ExtraccionDeProductos) => {
    ecommerce(ExtraccionDeProductos);
  });
function ecommerce(productos) {
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  // Elementos a los que se va a acceder
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------//

  //-- Contenedores --
  const contenedor_cards = document.getElementById("contenedor_cards");
  const contenedorCarrito = document.getElementById("contenedor_carrito");
  const contenedorBadge = document.getElementById("contenedor_badge")

  //-- Barra de busqueda --
  const BarraDeBusqueda = document.getElementById("barra_de_busqueda");
  BarraDeBusqueda.onchange = botonRealizarBusqueda;
  const botonBuscar = document.getElementById("boton_buscar");
  botonBuscar.onclick = botonRealizarBusqueda;
  const botonLimpiarBusqueda = document.getElementById("limpiar_busqueda");
  botonLimpiarBusqueda.onclick = limpiarBusqueda;

  //-- Filtro --
  const filtroPrecioMax = document.getElementById("max_min");
  filtroPrecioMax.onclick = FiltradoPrecioMax;
  const filtroPrecioMin = document.getElementById("min_max");
  filtroPrecioMin.onclick = FiltradoPrecioMin;

  //-- Categorias --
  const categoriaLateral = document.getElementsByClassName("categorias");
  for(const comprobarCategoria of categoriaLateral){
    comprobarCategoria.onclick = filtradoPorCategoria;
  };

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  // Variables
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  let carrito = [];
  let filtroCheck = [];
  let subTotal = [];
  let total;
  let filtrados = "";
  let busqueda = "";

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  // Funcion Para Mostrar Los Productos En El HTML
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  function mostrarProductos(productos) {
    contenedor_cards.innerHTML = "";
    productos.forEach((producto) => {
      let contenedor_producto = document.createElement("article");
      contenedor_producto.className = "col-lg-3 col-md-4 col-sm-6 align-i";
      contenedor_producto.innerHTML = `
                <div class="bg-card">
                    <a href="/web-pages/products/sample-product-04.html"><img src="${producto.img}" class="card-img-top" alt="item-25"></a>
                    <div class="card-body d-flex flex-column">
                        <h4 class="card-title mb-2">${producto.nombre}</h4>
                        <h5 class="bg-price">$${producto.precio}</h5>
                        <button class="botonAgregarAlCarrito mt-auto btn btn-dark" id="${producto.id}">Comprar</button>
                    </div>
                </div>
            `;
        contenedor_cards.appendChild(contenedor_producto);
    });
    let botonAgregarAlCarrito = document.querySelectorAll(`.botonAgregarAlCarrito`);
    botonAgregarAlCarrito.forEach((producto) => (producto.onclick = agregarAlCarrito));
    if (localStorage.getItem("productoUsuario") != null){
      carrito = JSON.parse(localStorage.getItem("productoUsuario"));
      renderizarCarrito();
    } else {
      localStorage.clear();
      renderizarCarrito();
    }
    if (contenedor_cards.innerHTML == "") {
      contenedor_cards.innerHTML += `
            <div id="bg-no-product">
                <p>No se ha encontrado este producto</p>
            </div>
        `;
    }
  }

  mostrarProductos(productos);

  function mostrarProductosFiltrados(productos) {
    contenedor_cards.innerHTML = "";
    productos.forEach((producto) => {
      let contenedor_producto = document.createElement("article");
      contenedor_producto.className = "col-lg-3 col-md-4 col-sm-6 align-i";
      contenedor_producto.innerHTML = `
                <div class="bg-card">
                    <a href="/web-pages/products/sample-product-04.html"><img src="${producto.img}" class="card-img-top" alt="item-25"></a>
                    <div class="card-body d-flex flex-column">
                        <h4 class="card-title mb-2">${producto.nombre}</h4>
                        <h5 class="bg-price">$${producto.precio}</h5>
                        <button class="botonAgregarAlCarrito mt-auto btn btn-dark" id="${producto.id}">Comprar</button>
                    </div>
                </div>
            `;
        contenedor_cards.appendChild(contenedor_producto);
    });
    let botonAgregarAlCarrito = document.querySelectorAll(`.botonAgregarAlCarrito`);
    botonAgregarAlCarrito.forEach((producto) => (producto.onclick = agregarAlCarrito));
    if (contenedor_cards.innerHTML == "") {
      contenedor_cards.innerHTML += `
            <div id="bg-no-product">
                <p>No se ha encontrado este producto</p>
            </div>
        `;
    }
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  // Funcion para renderizar el carrito
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  function renderizarCarrito() {
    subTotal = [];
    carrito.forEach((producto) => subTotal.push(producto.cantidad * producto.precio));
    total = subTotal.reduce((parametro, producto) => parametro + producto, 0);
    carrito.forEach((producto) => (contenedorCarrito.innerHTML += `
            <div class="bg-offcanvas-card">
                <div class="row">
                    <div class="col-md-12 bg-offcanvas-name">
                        <p>${producto.nombre}</p>
                        <button class="quitarArticulo btn btn-danger" id="quitar${producto.id}">x</button>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-md-4">
                        <img class="img-fluid bg-offcanvas-img" src="${producto.img}" alt="${producto.nombre}">
                    </div>
                    <div class="col-md-4 bg-offcanvas-info">
                        <span>Sku: ${producto.id}</span>
                        <span>Talle: ${producto.talle}</span>
                        <span>Color: ${producto.color}</span>
                    </div>
                    <div class="col-md-4 bg-offcanvas-buttons">
                        <button  class ="AgregarArticulo btn btn-dark" id="sumar${
                          producto.id
                        }">+</button>   
                        <span>${producto.cantidad}</span>
                        <button  class="RestarArticulo btn btn-dark" id="restar${
                          producto.id
                        }">-</button>   
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-md-12 bg-offcanvas-total">
                        <h3>Total: <span>$${
                          producto.cantidad * producto.precio
                        }</span></h3>
                    </div>
                </div>
            </div>
        `)
    );
    if (carrito != "") {
      contenedorCarrito.innerHTML += `
                <div id="offcanvas-footer">
                    <div class="bg-price-offcanvas">
                        <h3>Subtotal: <span>$${total}</span></h3>
                    </div>
                    <div class="bg-buy-offcanvas">
                        <button type="button" class="btn btn-dark" id="buttonFinalizarCompra">Comprar</button>
                    </div>
                </div>      
            `;
      let botonSumar = document.querySelectorAll(`.AgregarArticulo`);
      let botonRestar = document.querySelectorAll(`.RestarArticulo`);
      let botonEliminarArticulo = document.querySelectorAll(`.quitarArticulo`);
      let botonFinalizar = document.getElementById("buttonFinalizarCompra"); 
      botonFinalizar.addEventListener("click", finalizarCompra);
      botonEliminarArticulo.forEach(
        (producto) => (producto.onclick = eliminarDelCarrito)
      );
      botonRestar.forEach((producto) => (producto.onclick = restarArticulo));
      botonSumar.forEach((producto) => (producto.onclick = sumarArticulo));
      localStorage.setItem("productoUsuario", JSON.stringify(carrito));
    } else {
      contenedorCarrito.innerHTML += `
          <div>
              <span>Tu carrito está vacío.</span>
          </div>
      `;
    }
  }


  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  // Funciones del carrito
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  function agregarAlCarrito(x) {
    contenedorCarrito.innerText = "";
    let idProducto = Number(comparadorId(x.target.id));
    if (carrito.find((producto) => producto.id == idProducto)) {
      let indice = carrito.indexOf(
        carrito.find((producto) => producto.id == idProducto)
        );
        carrito[indice].cantidad++;
      } else {
        carrito.push(productos.find((producto) => producto.id == idProducto));
        carrito[carrito.length - 1].cantidad = 1;
      }
      contadorCarrito()
      renderizarCarrito();
      
    let timerInterval;
    Swal.fire({
      title: "¡Se ha agregado el producto al carrito!",
      timer: 2500,
      toast: true,
      target: "#sweetAlertToast",
      position: "bottom-right",
      timerProgressBar: true,
      showConfirmButton: false,
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
  }
  
  //--------------------------------------------------------------------------------------//
  function comparadorId(e) {
    let idObtenido = "";
    for (i = 0; i < e.length; i++) {
      if (isNaN(e[i]) == false) {
        idObtenido = idObtenido + e[i];
      }
    }
    return idObtenido;
  }

  //--------------------------------------------------------------------------------------//
  function eliminarDelCarrito(x) {
    contenedorCarrito.innerText = "";
    let idProducto = Number(comparadorId(x.target.id));
    let pEliminar = carrito.indexOf(
      carrito.find((producto) => idProducto == producto.id)
      );
      carrito.splice(pEliminar, 1);
      if (carrito.length == 0) {
        localStorage.clear();
        contenedorCarrito.innerText = "";
      }
      renderizarCarrito();
  }
    
  //--------------------------------------------------------------------------------------//
  function restarArticulo(x) {
    contenedorCarrito.innerText = "";
    let idProducto = Number(comparadorId(x.target.id));
    if (carrito.find((producto) => producto.id == idProducto)) {
      let indice = carrito.indexOf(
        carrito.find((producto) => producto.id == idProducto)
        );
        if (carrito[indice].cantidad > 1) {
          carrito[indice].cantidad--;
        }
      }
      renderizarCarrito();
  }
    
  //--------------------------------------------------------------------------------------//
  function sumarArticulo(x) {
    contenedorCarrito.innerText = "";
  let idProducto = Number(comparadorId(x.target.id));
  if (carrito.find((producto) => producto.id == idProducto)) {
    let indice = carrito.indexOf(
      carrito.find((producto) => producto.id == idProducto)
      );
      carrito[indice].cantidad++;
    }
    renderizarCarrito();
  }
    
  //--------------------------------------------------------------------------------------//
  function contadorCarrito() {
      
  }
      
      
      
      
      
      
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  // Funciones de la barra de busqueda
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  function limpiarBusqueda() {
    busqueda = "";
    BarraDeBusqueda.value = "";
    filtroCheck == "" ? mostrarProductosFiltrados(productos) : filtradoPorCategoria();
  }
  //-------------------------------------------------------------------------//
  function botonRealizarBusqueda() {
    filtrados = "";
    busqueda = BarraDeBusqueda.value;
    filtrados = productos.filter(
      ({ categoria, nombre, genero, talle, color }) =>
        categoria.toLowerCase().includes(busqueda) ||
        nombre.toLowerCase().includes(busqueda) ||
        genero.toLowerCase().includes(busqueda) ||
        talle.toLowerCase().includes(busqueda) ||
        color.toLowerCase().includes(busqueda)
    );

    filtroCheck == "" ? mostrarProductosFiltrados(filtrados) : filtradoPorCategoria();
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  // Funciones del filtro dropdown
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  function FiltradoPrecioMax() {
    if (filtroPrecioMax.checked) {
      productos.sort((x, y) => y.precio - x.precio);
      filtroPrecioMin.checked = false;
    } else {
      productos.sort((x, y) => x.id - y.id);
    }
    filtradoPorCategoria();
  }
  //-------------------------------------------------------------------------//
  function FiltradoPrecioMin() {
    if (filtroPrecioMin.checked) {
      filtroPrecioMax.checked = false;
      productos.sort((x, y) => x.precio - y.precio);
    } else {
      productos.sort((x, y) => x.id - y.id);
    }
    filtradoPorCategoria();
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  // Funcion para el filtrado dropdown y filtrado por categoria
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  function filtradoPorCategoria() {
    filtroCheck = [];
    let filtrarPrecio = "";
    function minToMax() {
      if (filtroPrecioMin.checked) {
        filtroPrecioMax.checked = false;
        filtrados.sort((x, y) => x.precio - y.precio);
      } else if (filtroPrecioMax.checked) {
        filtroPrecioMin.checked = false;
        filtrados.sort((x, y) => y.precio - x.precio);
      } else {
        filtrados.sort((x, y) => x.id - y.id);
      }
    }
    for (const comprobarCategoria of categoriaLateral) {
      comprobarCategoria.checked && filtroCheck.push(comprobarCategoria.id);
    }
    if (busqueda == "") {
      filtrados = productos.filter(({ categoria}) =>
        filtroCheck.includes(quitarEspacios(categoria))
      );
      filtroCheck == ""
        ? mostrarProductosFiltrados(productos)
        : mostrarProductosFiltrados(filtrados);
    } else {
      if (filtroCheck == "") {
        minToMax();
        mostrarProductosFiltrados(filtrados);
      } else {
        minToMax();
        filtrarPrecio = filtrados.filter(({ categoria }) =>
          filtroCheck.includes(quitarEspacios(categoria, color))
        );
        mostrarProductosFiltrados(filtrarPrecio);
      }
    }
  }
  function quitarEspacios(e) {
    let resultado = "";
    for (i = 0; i < e.length; i++) {
      e[i] == " " ? (resultado += "_") : (resultado += e[i]);
    }
    return resultado;
  }


  
  function finalizarCompra(){
    let ventana_envio = document.createElement("div")
    ventana_envio.className ="ventana_finalizado_comprar"

    Swal.fire({
        title: '¿Quiere confirmar su compra?',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',            
        cancelButtonColor: '#d9534f',
        width: 650,
        confirmButtonText: ' Si ',
        cancelButtonText: 'No, seguir Comprando',
        backdrop: `
        rgba(0,0,0,0.5)
        `
        }).then((result) => {
        if (result.isConfirmed) {
            window.location = "form.html"
        }
    })

  } 
}
