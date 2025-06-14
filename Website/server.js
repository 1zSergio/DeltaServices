// server.js

// 1. Importar las herramientas que necesitamos (Express y Path)
const express = require('express');
const path = require('path');

// 2. Crear nuestra aplicación de Express
const app = express();
const PORT = 3000; // El puerto donde funcionará nuestro servidor

// 3. Configuración del servidor
// Le decimos a Express que vamos a usar EJS como motor de plantillas
app.set('view engine', 'ejs');
// Le decimos dónde está la carpeta que contiene nuestras plantillas (archivos .ejs)
app.set('views', path.join(__dirname, 'views'));

// Le decimos a Express que la carpeta "public" contiene archivos estáticos (como CSS, imágenes, etc.)
// que se pueden acceder directamente desde el navegador.
// Esta línea es la que hace la magia
app.use(express.static(path.join(__dirname, 'public')));


// 4. Definir las rutas (las "páginas" de nuestra web)

// Cuando alguien visite la página principal (ej: http://localhost:3000/) ...
app.get('/', (req, res) => {
  // ... le respondemos renderizando (dibujando) el archivo "index.ejs"
  res.render('index'); 
});


// 5. Iniciar el servidor para que empiece a escuchar peticiones
app.listen(PORT, () => {
  console.log(`✅ ¡Servidor funcionando correctamente en http://localhost:${PORT}`);
});