const contenedor = document.querySelector("#contenedor")
const carrito = []

async function cargarProductos() {
  const resp = await fetch("./trabajos.json")
  const prods = await resp.json()
  mostrarProds(prods)  
}

function mostrarProds(prods) {
  contenedor.innerHTML = "" //limpio el div con el id #contenedor antes de mostrar los trabajos
  prods.forEach((elemento => {
    let divProducto = document.createElement("div")
    divProducto.innerHTML = `<div class="col-sm-12 col-md-6 col-lg-4">
    <div class="card" style="width: 18rem;">
        <img src="${elemento.img}" alt="${elemento.nombre}">
        <div class="card-body">
        <h5 class="card-title">${elemento.nombre}</h5>
        <p>Precio: USD ${elemento.precio}</p>
        <a href="#" id="${elemento.id}" class="bt-boot btn btn-primary">Mostrar</a>
        </div>
    </div>
</div>`
    contenedor.appendChild(divProducto)
    
    const btnMostrar = document.getElementById(`${elemento.id}`) //guardamos c/boton en una variable
    btnMostrar.addEventListener("click", () => agregarAlCarrito(prods, elemento.id)) //asignamos al evento de c/boton la funcion que agrega un objeto al array carrito
  }))
}

//Funcion que agrega al array carrito (definido arriba) los elementos definidos por elemento.id
function agregarAlCarrito (prods, id) {
  const prodEncontrado = prods.find((prod) => prod.id === id)
  carrito.push(prodEncontrado)
  localStorage.setItem("carrito", JSON.stringify(carrito))

  console.log(carrito)
}


function confirmarCarga() {
  Swal.fire({
    title: "¿Deseas mostrar los trabajos?",
    icon: "question",
    showDenyButton: true,
    confirmButtonText: "Mostrar",
    denyButtonText: `No mostrar`
  }).then((result) => {
    
    if (result.isConfirmed) {
      cargarProductos()      
    } else if (result.isDenied) {
      Swal.fire("Carga cancelada", "", "error");
    }
})
}


const botonAlerta = document.getElementById("sweetAlertButton") //Boton "Cargar Trabajos"

botonAlerta.addEventListener("click", () => {
    confirmarCarga()
    })

//Buscador!!!!
const inputBusqueda = document.getElementById("inputSearch")

inputBusqueda.addEventListener("change", () => {
  const inputValue = inputBusqueda.value.toUpperCase()
  console.log(inputValue)

  if (inputValue === ""){
    cargarProductos()
  }else{
    fetch("./trabajos.json") //hacemos el fetch
    .then(response => response.json()) //transforma la data recogida por el fetch a un formato legible desde el frontend
    .then(data =>{
      const productosFiltrados = data.filter((prod) => prod.nombre.includes(inputValue))
        if (productosFiltrados.length > 0) {
          mostrarProds(productosFiltrados)
        }else{
          Swal.fire({
            title: "error",
            icon: "error",
            text: "No se encontraron productos"
          })
        }
      
    })
  }
})