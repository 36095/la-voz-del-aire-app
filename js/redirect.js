// URL de destino
const destination = 'https://tunc.cl';
/**
 * !! **importante:** Cambia a false en producción
 * @type {boolean}
 *
 * MEMO: usar una variable de entorno para no tener que cambiar esto en cada despliague
 */
const isDev = false;

// Recuperar la URL actual del cliente
const inputURL = window.location.href;

// Expresiones regulares para verificar las condiciones
const ipRegex =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:\d+)?$/;
const pagesDevRegex = /^.*\.pages\.dev/;
const unwantedQueryParams = [
  'fbclid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'igshid',
]; // Parámetros no deseados

// Función para verificar si la URL tiene query params no deseados
function hasUnwantedParams(url) {
  const urlObj = new URL(url);
  return unwantedQueryParams.some((param) => urlObj.searchParams.has(param));
}

// Función para limpiar los query params no deseados
function removeUnwantedParams(url) {
  const urlObj = new URL(url);
  unwantedQueryParams.forEach((param) => urlObj.searchParams.delete(param));
  return urlObj;
}

// Función para redirigir si estamos en producción
function redirectToDestination(pathname) {
  const newURL = `${destination}${pathname}`;
  console.log('Redirigiendo a producción:', newURL);
  window.location.replace(newURL);
}

// Función principal que maneja la lógica de redirección
function redirectIfMatch(url) {
  const urlObj = new URL(url);
  const hostname = urlObj.hostname;
  const pathname = urlObj.pathname;

  // Si hay query params no deseados, limpiarlos
  if (hasUnwantedParams(url)) {
    const cleanedURLObj = removeUnwantedParams(url);

    if (!isDev) {
      // Redirigir a la URL de destino sin query params en producción
      redirectToDestination(pathname);
    } else {
      // Redirigir en desarrollo al mismo host sin query params
      const cleanedURL = `${window.location.origin}${pathname}${cleanedURLObj.search}`;
      console.log('Modo desarrollo: Redirigiendo a:', cleanedURL);
      window.location.replace(cleanedURL);
    }
  } else {
    // Si no hay query params no deseados
    if (!isDev) {
      // Siempre redirigir a la URL de destino en producción
      redirectToDestination(pathname);
    } else {
      console.log('Modo desarrollo: No se necesita redirección.');
    }
  }
}

// Comprobación inicial de query params
const urlObj = new URL(inputURL);
if (urlObj.search || !isDev) {
  // Llamar a la función si hay query params o estamos en producción
  redirectIfMatch(inputURL);
} else {
  console.log('La URL no tiene query params, y no estamos en producción.');
}
