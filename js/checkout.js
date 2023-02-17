fetch("/js/productos-local.json")
  .then((response) => response.json())
  .then((ExtraccionDeProductos) => {
    ecommerce(ExtraccionDeProductos);
  });
function ecommerce(productos) {
  //-- Contenedores --
  const contenedorCarrito = document.getElementById("contenedor_carrito");

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
  // Funcion para renderizar el carrito
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  function renderizarCarrito() {
    subTotal = [];
    carrito.forEach((producto) =>
      subTotal.push(producto.cantidad * producto.precio)
    );
    total = subTotal.reduce((parametro, producto) => parametro + producto, 0);
    carrito.forEach(
      (producto) =>
        (contenedorCarrito.innerHTML += `
            <div class="bg-offcanvas-card">
                <div class="row">
                    <div class="col-md-12 bg-offcanvas-name">
                        <p>${producto.nombre}</p>
                        <button class="quitarArticulo btn btn-danger" id="quitar${
                          producto.id
                        }">x</button>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-md-4">
                        <img class="img-fluid bg-offcanvas-img" src="${
                          producto.img
                        }" alt="${producto.nombre}">
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
                        <button type="button" class="btn btn-dark" id="buttonFinalizarCompra">Finalizar Compra</button>
                    </div>
                </div>      
            `;
      let botonSumar = document.querySelectorAll(`.AgregarArticulo`);
      let botonRestar = document.querySelectorAll(`.RestarArticulo`);
      let botonEliminarArticulo = document.querySelectorAll(`.quitarArticulo`);

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


  let botonFinalizar = document.getElementById("RealizarPago");
  botonFinalizar.addEventListener("click", finalizarCompra);
  function finalizarCompra() {
      Swal.fire({
        title: "¡Gracias Por Su Compra!",
        confirmButtonColor: "#292b2c",
        onOpen: function() {
            let sound = new Audio('/images/Success.mp3')
          sound.play();
        },
        backdrop: `
            rgba(0,0,0,0.5)
            `,
      });
  }

  function CompraFinalizada() {
    localStorage.clear();
    carrito = [];
    contenedorCarrito.innerText = "";
    renderizarCarrito();
  }
  CompraFinalizada();


    const audio = new Audio("/images/Success.mp3");
    
    const buttons = document.querySelectorAll("button");

    buttons.forEach(button => {
    button.addEventListener("click", () => {
        audio.play();
    });
    });

}
