// =======================
// UTILIDADES GENERALES
// =======================
function mostrarMensaje(idElemento, mensaje, color = "red") {
  const elemento = document.getElementById(idElemento);
  if (elemento) {
    elemento.textContent = mensaje;
    elemento.style.color = color;
  }
}

function validarCorreo(correo) {
  const regex = /^[\w.-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
  return regex.test(correo);
}

function validarRUN(run) {
  const regex = /^[0-9]{7,8}[0-9kK]$/;
  return regex.test(run);
}

// =======================
// LOCALSTORAGE HELPERS
// =======================
function guardarEnLS(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function obtenerDeLS(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// =======================
// REGISTRO DE USUARIO
// =======================
const formRegistro = document.getElementById("formRegistro");
if (formRegistro) {
  formRegistro.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (nombre === "" || email === "" || password === "") {
      mostrarMensaje("mensaje", "Todos los campos son obligatorios.");
      return;
    }
    if (!validarCorreo(email)) {
      mostrarMensaje("mensaje", "Correo inválido (solo duoc.cl, profesor.duoc.cl o gmail.com).");
      return;
    }
    if (password.length < 4 || password.length > 10) {
      mostrarMensaje("mensaje", "La contraseña debe tener entre 4 y 10 caracteres.");
      return;
    }

    const usuarios = obtenerDeLS("usuariosFront");
    if (usuarios.find(u => u.email === email)) {
      mostrarMensaje("mensaje", "El correo ya está registrado.");
      return;
    }

    usuarios.push({ nombre, email, password, tipo: "cliente" }); // tipo cliente por defecto
    guardarEnLS("usuariosFront", usuarios);

    mostrarMensaje("mensaje", "Registro exitoso, bienvenido " + nombre + "!", "green");
    formRegistro.reset();
  });
}

// =======================
// LOGIN
// =======================
const formLogin = document.getElementById("formLogin");
if (formLogin) {
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("emailLogin").value.trim();
    const password = document.getElementById("passwordLogin").value.trim();

    if (!validarCorreo(email)) {
      mostrarMensaje("mensajeLogin", "Correo inválido.", "red");
      return;
    }
    if (password.length < 4 || password.length > 10) {
      mostrarMensaje("mensajeLogin", "La contraseña debe tener entre 4 y 10 caracteres.", "red");
      return;
    }

    const usuariosFront = obtenerDeLS("usuariosFront");
    const usuariosAdmin = obtenerDeLS("usuarios"); // los creados desde admin
    const todosUsuarios = [...usuariosFront, ...usuariosAdmin];

    const user = todosUsuarios.find(u => u.email === email && u.password === password);

    if (user) {
      mostrarMensaje("mensajeLogin", "Inicio de sesión exitoso, bienvenido " + user.nombre + "!", "green");
      localStorage.setItem("usuarioActivo", JSON.stringify(user));

      if (user.tipo === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "index.html";
      }
    } else {
      mostrarMensaje("mensajeLogin", "Usuario o contraseña incorrectos.", "red");
    }
  });
}

// =======================
// LOGOUT
// =======================
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "login.html";
  });
}

// =======================
// CONTACTO
// =======================
const formContacto = document.getElementById("formContacto");
if (formContacto) {
  formContacto.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombreC").value.trim();
    const email = document.getElementById("emailC").value.trim();
    const comentario = document.getElementById("comentario").value.trim();

    if (nombre === "" || comentario === "") {
      mostrarMensaje("mensajeContacto", "Nombre y comentario son obligatorios.");
      return;
    }
    if (!validarCorreo(email)) {
      mostrarMensaje("mensajeContacto", "Correo inválido.", "red");
      return;
    }
    if (comentario.length > 500) {
      mostrarMensaje("mensajeContacto", "Comentario demasiado largo (máx 500).");
      return;
    }

    mostrarMensaje("mensajeContacto", "Mensaje enviado correctamente.", "green");
    formContacto.reset();
  });
}

// =======================
// ADMIN - PRODUCTOS
// =======================
const formProducto = document.getElementById("formProducto");
const tablaProductos = document.getElementById("tablaProductos");

function renderProductos() {
  if (!tablaProductos) return;
  const productos = obtenerDeLS("productos");
  tablaProductos.innerHTML = "";
  productos.forEach((p, i) => {
    tablaProductos.innerHTML += `
      <tr>
        <td>${p.codigo}</td>
        <td>${p.nombre}</td>
        <td>${p.precio}</td>
        <td>${p.stock}</td>
        <td>${p.categoria}</td>
        <td><button onclick="eliminarProducto(${i})">❌</button></td>
      </tr>
    `;
  });
}

if (formProducto) {
  formProducto.addEventListener("submit", (e) => {
    e.preventDefault();
    const codigo = document.getElementById("codigo").value.trim();
    const nombre = document.getElementById("nombreProducto").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);
    const stock = parseInt(document.getElementById("stock").value);
    const categoria = document.getElementById("categoria").value;

    if (codigo.length < 3 || nombre === "" || isNaN(precio) || isNaN(stock) || categoria === "") {
      alert("Revisa los campos obligatorios.");
      return;
    }
    if (precio < 0 || stock < 0) {
      alert("Precio y stock no pueden ser negativos.");
      return;
    }

    const productos = obtenerDeLS("productos");
    productos.push({ codigo, nombre, precio, stock, categoria });
    guardarEnLS("productos", productos);

    alert("Producto guardado con éxito!");
    formProducto.reset();
    renderProductos();
  });

  renderProductos();
}

function eliminarProducto(index) {
  const productos = obtenerDeLS("productos");
  productos.splice(index, 1);
  guardarEnLS("productos", productos);
  renderProductos();
}

// =======================
// ADMIN - USUARIOS
// =======================
const formUsuario = document.getElementById("formUsuario");
const tablaUsuarios = document.getElementById("tablaUsuarios");

function renderUsuarios() {
  if (!tablaUsuarios) return;
  const usuarios = obtenerDeLS("usuarios");
  tablaUsuarios.innerHTML = "";
  usuarios.forEach((u, i) => {
    tablaUsuarios.innerHTML += `
      <tr>
        <td>${u.run}</td>
        <td>${u.nombre} ${u.apellido}</td>
        <td>${u.correo}</td>
        <td>${u.tipo}</td>
        <td>${u.region}, ${u.comuna}</td>
        <td><button onclick="eliminarUsuario(${i})">❌</button></td>
      </tr>
    `;
  });
}

if (formUsuario) {
  formUsuario.addEventListener("submit", (e) => {
    e.preventDefault();
    const run = document.getElementById("run").value.trim();
    const correo = document.getElementById("correoU").value.trim();
    const nombre = document.getElementById("nombreU").value.trim();
    const apellido = document.getElementById("apellidoU").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const region = document.getElementById("region").value;
    const comuna = document.getElementById("comuna").value;
    const tipo = document.getElementById("tipoUsuario").value;

    if (!validarRUN(run)) {
      alert("RUN inválido.");
      return;
    }
    if (!validarCorreo(correo)) {
      alert("Correo inválido.");
      return;
    }
    if (!nombre || !apellido || !direccion || !region || !comuna || !tipo) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    const usuarios = obtenerDeLS("usuarios");
    usuarios.push({ run, correo, nombre, apellido, direccion, region, comuna, tipo, password: "1234" }); 
    guardarEnLS("usuarios", usuarios);

    alert("Usuario registrado con éxito! Contraseña por defecto: 1234");
    formUsuario.reset();
    renderUsuarios();
  });

  // Regiones y comunas dinámicas
  const regiones = {
    "RM": ["Santiago", "Puente Alto", "San Bernardo"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"],
    "Biobío": ["Concepción", "Talcahuano", "Los Ángeles"]
  };

  const regionSelect = document.getElementById("region");
  const comunaSelect = document.getElementById("comuna");

  if (regionSelect && comunaSelect) {
    regionSelect.innerHTML = `<option value="">Seleccione región</option>`;
    Object.keys(regiones).forEach(r => {
      regionSelect.innerHTML += `<option value="${r}">${r}</option>`;
    });

    regionSelect.addEventListener("change", () => {
      const comunaList = regiones[regionSelect.value] || [];
      comunaSelect.innerHTML = `<option value="">Seleccione comuna</option>`;
      comunaList.forEach(c => {
        comunaSelect.innerHTML += `<option value="${c}">${c}</option>`;
      });
    });
  }

  renderUsuarios();
}

function eliminarUsuario(index) {
  const usuarios = obtenerDeLS("usuarios");
  usuarios.splice(index, 1);
  guardarEnLS("usuarios", usuarios);
  renderUsuarios();
}

// =======================
// CATÁLOGO DE PRODUCTOS
// =======================
function renderCatalogo() {
  const catalogoContainer = document.getElementById("catalogoContainer");
  if (!catalogoContainer) return;

  const productos = obtenerDeLS("productos");
  catalogoContainer.innerHTML = "";

  if (productos.length === 0) {
    catalogoContainer.innerHTML = "<p>No hay productos disponibles.</p>";
    return;
  }

  productos.forEach((p, i) => {
    catalogoContainer.innerHTML += `
      <div class="card">
        <h3>${p.nombre}</h3>
        <p>Código: ${p.codigo}</p>
        <p>Precio: $${p.precio}</p>
        <p>Stock: ${p.stock}</p>
        <p>Categoría: ${p.categoria}</p>
        <button onclick="agregarAlCarrito('${p.nombre}', ${p.precio})">Añadir al carrito</button>
      </div>
    `;
  });
}

renderCatalogo();

// =======================
// CARRITO DE COMPRAS
// =======================
function obtenerCarrito() {
  return obtenerDeLS("carrito");
}

function guardarCarrito(carrito) {
  guardarEnLS("carrito", carrito);
}

function agregarAlCarrito(nombre, precio) {
  const carrito = obtenerCarrito();
  carrito.push({ nombre, precio });
  guardarCarrito(carrito);
  alert(nombre + " agregado al carrito!");
  mostrarCarrito();
}

function mostrarCarrito() {
  const listaCarrito = document.getElementById("listaCarrito");
  const totalCarrito = document.getElementById("totalCarrito");
  if (!listaCarrito || !totalCarrito) return;

  const carrito = obtenerCarrito();
  listaCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach((p, i) => {
    listaCarrito.innerHTML += `<p>${p.nombre} - $${p.precio} <button onclick="eliminarDelCarrito(${i})">❌</button></p>`;
    total += p.precio;
  });

  totalCarrito.textContent = "Total: $" + total;
}

function eliminarDelCarrito(index) {
  const carrito = obtenerCarrito();
  carrito.splice(index, 1);
  guardarCarrito(carrito);
  mostrarCarrito();
}

if (document.getElementById("listaCarrito")) {
  mostrarCarrito();
}
