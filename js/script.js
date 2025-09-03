// =======================
// VALIDACIONES GENERALES
// =======================
function validarCorreo(correo) {
  const patron = /^[\w.-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
  return patron.test(correo);
}

function mostrarMensaje(elemento, texto, color) {
  elemento.textContent = texto;
  elemento.style.color = color;
}

// =======================
// REGISTRO DE USUARIOS
// =======================
const formRegistro = document.getElementById("formRegistro");
if (formRegistro) {
  formRegistro.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const mensaje = document.getElementById("mensaje");

    if (nombre === "" || email === "" || password === "") {
      mostrarMensaje(mensaje, "Todos los campos son obligatorios.", "red");
      return;
    }

    if (!validarCorreo(email)) {
      mostrarMensaje(mensaje, "Correo no válido (solo @duoc.cl, @profesor.duoc.cl o @gmail.com).", "red");
      return;
    }

    if (password.length < 4 || password.length > 10) {
      mostrarMensaje(mensaje, "La contraseña debe tener entre 4 y 10 caracteres.", "red");
      return;
    }

    mostrarMensaje(mensaje, "Registro exitoso, bienvenido " + nombre + "!", "green");
    formRegistro.reset();
  });
}

// =======================
// LOGIN
// =======================
const formLogin = document.getElementById("formLogin");
if (formLogin) {
  formLogin.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("emailLogin").value.trim();
    const password = document.getElementById("passwordLogin").value.trim();
    const mensajeLogin = document.getElementById("mensajeLogin");

    if (!validarCorreo(email)) {
      mostrarMensaje(mensajeLogin, "Correo no válido.", "red");
      return;
    }
    if (password.length < 4 || password.length > 10) {
      mostrarMensaje(mensajeLogin, "Contraseña inválida.", "red");
      return;
    }
    mostrarMensaje(mensajeLogin, "Login exitoso. Bienvenido!", "green");
    formLogin.reset();
  });
}

// =======================
// CONTACTO
// =======================
const formContacto = document.getElementById("formContacto");
if (formContacto) {
  formContacto.addEventListener("submit", function (e) {
    e.preventDefault();
    const nombre = document.getElementById("nombreC").value.trim();
    const correo = document.getElementById("emailC").value.trim();
    const comentario = document.getElementById("comentario").value.trim();
    const mensaje = document.getElementById("mensajeContacto");

    if (nombre === "" || comentario === "") {
      mostrarMensaje(mensaje, "Nombre y comentario son obligatorios.", "red");
      return;
    }
    if (!validarCorreo(correo)) {
      mostrarMensaje(mensaje, "Correo no válido.", "red");
      return;
    }
    if (comentario.length > 500) {
      mostrarMensaje(mensaje, "El comentario no puede superar 500 caracteres.", "red");
      return;
    }
    mostrarMensaje(mensaje, "Mensaje enviado correctamente.", "green");
    formContacto.reset();
  });
}

// =======================
// CARRITO DE COMPRAS
// =======================
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(nombre, precio) {
  let carrito = obtenerCarrito();
  carrito.push({ nombre, precio });
  guardarCarrito(carrito);
  alert(nombre + " añadido al carrito.");
}

function mostrarCarrito() {
  const listaCarrito = document.getElementById("listaCarrito");
  const totalCarrito = document.getElementById("totalCarrito");
  if (!listaCarrito || !totalCarrito) return;

  const carrito = obtenerCarrito();
  listaCarrito.innerHTML = "";

  if (carrito.length === 0) {
    listaCarrito.innerHTML = "<p>El carrito está vacío.</p>";
    totalCarrito.textContent = "";
    return;
  }

  let total = 0;
  carrito.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("item-carrito");
    div.innerHTML = `${item.nombre} - $${item.precio} 
      <button onclick="eliminarDelCarrito(${index})">❌</button>`;
    listaCarrito.appendChild(div);
    total += item.precio;
  });

  totalCarrito.textContent = "Total: $" + total;
}

function eliminarDelCarrito(index) {
  let carrito = obtenerCarrito();
  carrito.splice(index, 1);
  guardarCarrito(carrito);
  mostrarCarrito();
}

mostrarCarrito(); // Se ejecuta si estamos en carrito.html

// =======================
// ADMIN: PRODUCTOS
// =======================
const formProducto = document.getElementById("formProducto");
if (formProducto) {
  formProducto.addEventListener("submit", function (e) {
    e.preventDefault();
    const codigo = document.getElementById("codigo").value.trim();
    const nombre = document.getElementById("nombreProducto").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);
    const stock = parseInt(document.getElementById("stock").value);

    if (codigo.length < 3) {
      alert("El código debe tener al menos 3 caracteres.");
      return;
    }
    if (nombre === "" || nombre.length > 100) {
      alert("El nombre es obligatorio y debe tener menos de 100 caracteres.");
      return;
    }
    if (isNaN(precio) || precio < 0) {
      alert("El precio debe ser mayor o igual a 0.");
      return;
    }
    if (isNaN(stock) || stock < 0) {
      alert("El stock debe ser un número entero positivo.");
      return;
    }
    alert("Producto guardado correctamente.");
    formProducto.reset();
  });
}

// =======================
// ADMIN: USUARIOS
// =======================
const formUsuario = document.getElementById("formUsuario");
if (formUsuario) {
  // Regiones y comunas ejemplo (puedes ampliar)
  const regiones = {
    "Metropolitana": ["Santiago", "Puente Alto", "San Bernardo"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"]
  };

  const regionSelect = document.getElementById("region");
  const comunaSelect = document.getElementById("comuna");

  if (regionSelect) {
    Object.keys(regiones).forEach(region => {
      const option = document.createElement("option");
      option.value = region;
      option.textContent = region;
      regionSelect.appendChild(option);
    });

    regionSelect.addEventListener("change", function () {
      comunaSelect.innerHTML = "";
      regiones[this.value].forEach(comuna => {
        const option = document.createElement("option");
        option.value = comuna;
        option.textContent = comuna;
        comunaSelect.appendChild(option);
      });
    });
  }

  formUsuario.addEventListener("submit", function (e) {
    e.preventDefault();
    const run = document.getElementById("run").value.trim();
    const correo = document.getElementById("correoU").value.trim();

    if (!/^\d{7,8}[0-9kK]$/.test(run)) {
      alert("RUN inválido. Ejemplo: 19011022K");
      return;
    }
    if (!validarCorreo(correo)) {
      alert("Correo inválido.");
      return;
    }
    alert("Usuario guardado correctamente.");
    formUsuario.reset();
  });
}