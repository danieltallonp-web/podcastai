const https = require('https');

async function deletePodcasts() {
  // Hacer request a la API local para obtener podcasts del usuario
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/podcasts',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('Response:', data);
        resolve(data);
      });
    });

    req.on('error', (error) => {
      console.error('Error:', error.message);
      reject(error);
    });

    req.end();
  });
}

// No ejecutar, solo mostrar que no funciona con HTTPS sin certificados
console.log('Esto requiere credenciales de usuario y sesión de Clerk');
