const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');  // Importamos el módulo https
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { printf } = require('./functions');
require('dotenv').config();
const multer = require('multer');
const fs = require('fs');
const { createItem } = require('./src/controllers/bouquetsController');

const app = express();
const PORT = process.env.PORT || 5000;
const ORIGIN_URL = process.env.ORIGIN_URL;

// Ruta a los archivos de Certbot (ajusta según tu configuración) (Solo en produccion)
/*
const sslOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/acflowersdelivery.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/acflowersdelivery.com/cert.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/acflowersdelivery.com/chain.pem'), // Si es necesario
};*/

// Conectar a la base de datos
async function connectToDatabase() {
  try {
    process.on('warning', (warning) => {
      if (warning.name === 'DeprecationWarning') {
        printf('warn', `Deprecation Warning: ${warning.message}`);
      } else {
        printf('warn', `Warning: ${warning.message}`);
      }
    });

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    printf('success', 'MongoDB Connected\n');
  } catch (error) {
    if (error.message.includes('timeout')) { 
      printf('error', 'Connection Timeout Error: Unable to connect to MongoDB. Please check your network/firewall settings.');
      printf('error', `Error connecting to MongoDB: ${error}`);
    } else if (error.message.includes('network')) {
      printf('error', 'Network Error: Unable to connect to MongoDB. Please check your network/firewall settings.');
      printf('error', `Error connecting to MongoDB: ${error}`);
    } else if (error.code === 'EREFUSED' || error.syscall === 'querySrv') {
      printf('error', 'DNS Error: Unable to resolve MongoDB hostname. Please check your network configuration and ensure that MongoDB is accessible.');
      printf('error', `Error connecting to MongoDB: ${error}`);
    } else {
      printf('error', `Error connecting to MongoDB: ${error}`);
    }
  } 
}

async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    printf('success', 'MongoDB Disconnected');
  } catch (error) {
    printf('error', `Error disconnecting from MongoDB: ${error}`);
  }
}

// Llamar a la función para conectarse a la base de datos
connectToDatabase();

// Middleware para manejar grandes tamaños de carga
app.use(express.json({ limit: '50mb' }));  // Aumenta el límite de tamaño a 50 MB
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: (origin, callback) => {
    // Lista de orígenes permitidos
    const allowedOrigins = ORIGIN_URL;

    // Si el origen está en la lista permitida, se acepta la solicitud
    if (allowedOrigins.includes(origin) || !origin) {  // Si no hay origen (por ejemplo, cuando se hace desde Postman o cURL)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(cookieParser());

// Configurar el almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = 'images'; // La carpeta donde se guardará la imagen
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath); // Define el destino donde se guardará la imagen
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Asegura que cada imagen tenga un nombre único
  }
});

const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 150 * 1024 * 1024 }  // Limita el tamaño del archivo a 150 MB
});

// Usar el middleware `upload.single('image')` para recibir la imagen en el backend
app.post('/bouquets', upload.single('image'), createItem); // Aquí usamos el middleware de `multer`

// Rutas y endpoints
//const routes = require('./src/routes/routes'); //ruta
//app.use('/api/functions', routes); //endpoint

const accountsRoutes = require('./src/routes/accountsRoutes');
app.use('/api/accounts', accountsRoutes);

const bouquetsRoutes = require('./src/routes/bouquetsRoutes');
app.use('/api/bouquets', bouquetsRoutes);

const itemsRoutes = require('./src/routes/itemsRoutes');
app.use('/api/items', itemsRoutes);

const ordersRoutes = require('./src/routes/ordersRoutes');
app.use('/api/orders', ordersRoutes);

const routes = require('./src/routes/routes');
app.use('/api/routes', routes);

const stripeRoutes = require('./src/routes/stripeRoutes');
app.use('/api/stripe', stripeRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  printf('', `\nServidor en ejecución en el puerto ${PORT}`);
});

// Iniciar el servidor con HTTPS usando el certificado de Certbot (Solo en produccion)
/*
https.createServer(sslOptions, app).listen(PORT, () => {
  printf('', `\nServidor HTTPS en ejecución en el puerto ${PORT}`);
});
*/