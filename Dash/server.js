const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// --- CONFIGURACIÓN DE CLAVES Y URLS ---
const PTERODACTYL_URL = 'https://panel.deltaservice.xyz'; // URL de tu panel
const PTERODACTYL_ADMIN_API_KEY = 'ptla_rsnxPu235IzHyyKKeMbYBqElQQJJN66Lzig60Qqcog7	'; // TU CLAVE DE ADMIN (ptla_...)

const DISCORD_CLIENT_ID = '1386287716706160730';
const DISCORD_CLIENT_SECRET = 'Jf0mVyy_p23zBSycVzeTwiTBYhr-W6rO';
const DISCORD_REDIRECT_URI = `https://dash.deltaservice.xyz/callback.ejs`;

// --- CONFIGURACIÓN DEL SERVICIO DE CORREO (NODEMAILER) ---
const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ctdeltaservices@gmail.com', // <-- PON AQUÍ TU CORREO DE GMAIL
        pass: 'cssi tyrm ihox hlhc'  // <-- PON AQUÍ TU CONTRASEÑA DE APLICACIÓN DE 16 LETRAS
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- RUTAS DE LA APLICACIÓN ---

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.ejs'));
});

app.post('/api/discord-auth', async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ error: 'No se ha proporcionado el código.' });
    }

    try {
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: DISCORD_CLIENT_ID,
            client_secret: DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: DISCORD_REDIRECT_URI,
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { authorization: `Bearer ${tokenResponse.data.access_token}` },
        });

        const discordUser = userResponse.data;
        const searchUserUrl = `${PTERODACTYL_URL}/api/application/users`;
        const existingUserResponse = await axios.get(searchUserUrl, {
            headers: { 'Authorization': `Bearer ${PTERODACTYL_ADMIN_API_KEY}` },
            params: { 'filter[email]': discordUser.email }
        });

        let pteroUser = existingUserResponse.data.data[0];
        let wasJustCreated = false;
        let randomPassword = null; // Declaramos la variable aquí para que siempre esté disponible

        if (!pteroUser) {
            randomPassword = crypto.randomBytes(16).toString('hex'); // Asignamos el valor
            
            try {
                console.log(`Creando nuevo usuario en Pterodactyl para: ${discordUser.email}`);
                const createUserResponse = await axios.post(`${PTERODACTYL_URL}/api/application/users`, {
                    email: discordUser.email,
                    username: discordUser.username,
                    first_name: discordUser.global_name || discordUser.username,
                    last_name: 'User',
                    password: randomPassword,
                    language: 'en'
                }, {
                    headers: { 
                        'Authorization': `Bearer ${PTERODACTYL_ADMIN_API_KEY}`,
                        'Content-Type': 'application/json',
                        'Accept': 'Application/vnd.pterodactyl.v1+json'
                    }
                });
                pteroUser = createUserResponse.data;
                wasJustCreated = true;
                
            } catch (creationError) {
                if (creationError.response && creationError.response.data.errors && creationError.response.data.errors[0].code === 'ConnectionException') {
                    console.warn('Se detectó un ConnectionException. El usuario se creó pero el email del panel falló. Intentando recuperar usuario...');
                    const refetchUserResponse = await axios.get(searchUserUrl, {
                        headers: { 'Authorization': `Bearer ${PTERODACTYL_ADMIN_API_KEY}` },
                        params: { 'filter[email]': discordUser.email }
                    });

                    if (refetchUserResponse.data.data.length > 0) {
                        pteroUser = refetchUserResponse.data.data[0];
                        wasJustCreated = true; // Marcamos como creado para poder enviar el email
                        console.log('Recuperación del usuario exitosa.');
                    } else {
                        throw new Error('El usuario no pudo ser recuperado tras el error de conexión.');
                    }
                } else {
                    throw creationError;
                }
            }
        } else {
             console.log(`Usuario encontrado en Pterodactyl: ${pteroUser.attributes.username}`);
        }

        // Si el usuario se acaba de crear, enviamos el correo con la contraseña
        if (wasJustCreated && randomPassword) {
            const mailDetails = {
                from: `"OnyxHosting Panel" <tu_correo@gmail.com>`,
                to: discordUser.email,
                subject: '¡Bienvenido a OnyxHosting!',
                html: `
                    <h1>¡Hola, ${discordUser.username}!</h1>
                    <p>Tu cuenta para el panel de OnyxHosting ha sido creada con éxito.</p>
                    <p>Aquí tienes tus credenciales de acceso:</p>
                    <ul>
                        <li><strong>Panel:</strong> <a href="${PTERODACTYL_URL}">${PTERODACTYL_URL}</a></li>
                        <li><strong>Email:</strong> ${discordUser.email}</li>
                        <li><strong>Contraseña:</strong> <code>${randomPassword}</code></li>
                    </ul>
                    <p>Te recomendamos guardar esta contraseña en un lugar seguro, para cambiar la contraseña hazlo desde el panel de Pterodactyl.</p>
                `
            };

            await mailTransporter.sendMail(mailDetails);
            console.log(`📧 Correo de bienvenida enviado a ${discordUser.email}`);
        }

        res.json({
            isLoggedIn: true,
            username: discordUser.username,
            pteroUserId: pteroUser.attributes.id
        });

    } catch (error) {
        console.error('Error en el proceso de autenticación/creación:', error.response ? error.response.data.errors[0] : error.message);
        res.status(500).json({ error: 'Fallo durante la autenticación o creación de la cuenta.' });
    }
});

app.post('/api/get-servers', async (req, res) => {
    const { pteroUserId } = req.body;
    if (!pteroUserId) {
        return res.status(400).json({ error: 'Falta ID de usuario.' });
    }

    try {
        // Pedimos la lista de servidores del usuario. El include=allocations es clave.
        const response = await axios.get(`${PTERODACTYL_URL}/api/application/users/${pteroUserId}?include=servers.allocations`, {
            headers: { 'Authorization': `Bearer ${PTERODACTYL_ADMIN_API_KEY}` }
        });

        // La API devuelve los servidores y las asignaciones en el array 'included'.
        const includedData = response.data.included || [];
        const serversData = includedData.filter(item => item.object === 'server');
        const allocationsData = includedData.filter(item => item.object === 'allocation');

        if (serversData.length === 0) {
            return res.json([]);
        }
        
        const servers = serversData.map(server => {
            const attributes = server.attributes;
            const allocationRelationships = attributes.relationships.allocations.data;
            
            let ip = 'Sin Asignación';
            let port = '';

            // Comprobamos de forma segura si existe la información de la IP
            if (allocationRelationships && allocationRelationships.length > 0) {
                const mainAllocationId = allocationRelationships[0].id;
                const allocation = allocationsData.find(alloc => alloc.attributes.id == mainAllocationId);
                if (allocation) {
                    ip = allocation.attributes.ip_alias || allocation.attributes.ip;
                    port = allocation.attributes.port;
                }
            }
            
            // El estado del servidor no está en esta llamada, por lo que lo simulamos como "desconocido"
            // La forma correcta sería hacer otra llamada a /api/client/servers/{id}/resources,
            // pero eso requiere una clave de cliente, no de admin.
            // Para evitar el error 403, por ahora no podemos saber el estado real.
          

            return {
                id: attributes.identifier,
                name: attributes.name,
                ip: ip,
                port: port,
                is_online: isOnline, // Dejamos el estado como nulo para que el frontend decida qué mostrar
            };
        });
        
        res.json(servers);
        
    } catch (error) {
        console.error('Error al obtener los servidores:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'No se pudieron obtener los servidores.' });
            }
});


app.listen(PORT, () => {
  console.log(`✅ ¡Servidor funcionando correctamente en http://localhost:${PORT}`);
});
