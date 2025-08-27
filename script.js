document.getElementById("formRegistro").addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const mensaje = document.getElementById("mensaje");

  if (nombre === "" || email === "" || password === "") {
    mensaje.textContent = "⚠️ Todos los campos son obligatorios.";
    mensaje.style.color = "red";
    return;
  }

  if (!email.includes("@")) {
    mensaje.textContent = "⚠️ Ingresa un correo válido.";
    mensaje.style.color = "red";
    return;
  }

  if (password.length < 6) {
    mensaje.textContent = "⚠️ La contraseña debe tener al menos 6 caracteres.";
    mensaje.style.color = "red";
    return;
  }

  mensaje.textContent = "✅ Registro exitoso, bienvenido " + nombre + "!";
  mensaje.style.color = "green";

  // Aquí podrías simular guardar en localStorage o enviarlo a un backend
});