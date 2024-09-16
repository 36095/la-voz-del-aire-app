// URL de destino
const destination = 'https://tunc.cl';
const isDev = false;

// Recuperar la URL actual del cliente
const inputURL = window.location.href;

// Expresiones regulares para verificar las condiciones
const ipRegex =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:\d+)?$/;
const pagesDevRegex = /^.*\.pages\.dev/;

// Función para redirigir si la URL coincide con los criterios
function redirectIfMatch(url) {
  const urlObj = new URL(url);
  const hostname = urlObj.hostname;
  const pathname = urlObj.pathname;

  // Verificar si es una dirección IP o termina en .pages.dev
  if (ipRegex.test(hostname) || pagesDevRegex.test(hostname)) {
    const newURL = `${destination}${pathname}`;
    if (!isDev) {
      console.log('Redirigiendo a:', newURL);
      window.location.replace(newURL); // Simula redirección 301
    }
  } else {
    console.log('La URL no coincide con los criterios.');
  }
}

// Llamar a la función con la URL actual del cliente
redirectIfMatch(inputURL);
