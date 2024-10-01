// URL de destino
const destination = 'https://tunc.cl';
/**
 * !! **importante:** Cambia a false en producción
 * @type {boolean}
 *
 * MEMO: usar una variable de entorno para no tener que cambiar esto en cada despliague
 */
const isDev = false; // Cambia a false en producción

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

// Función para redirigir a la misma URL sin los query params
function redirectToSameURLWithoutParams(cleanedURL) {
  // console.log('Redirigiendo a la misma URL sin query params:', cleanedURL);
  window.location.replace(cleanedURL);
}

// Función para redirigir a la URL de destino en producción
function redirectToDestination(pathname) {
  const newURL = `${destination}${pathname}`;
  // console.log('Redirigiendo a producción:', newURL);
  window.location.replace(newURL);
}

// Función principal que maneja la lógica de eliminación de query params y redirección
function handleRedirect(url) {
  const urlObj = new URL(url);
  const hostname = urlObj.hostname;
  const pathname = urlObj.pathname;

  // Primero, eliminar los query params no deseados si están presentes
  if (hasUnwantedParams(url)) {
    const cleanedURLObj = removeUnwantedParams(url);
    const cleanedURL = `${window.location.origin}${pathname}${cleanedURLObj.search}`;

    // Redirigir primero a la misma URL sin query params
    redirectToSameURLWithoutParams(cleanedURL);
  } else if (!isDev) {
    // Si estamos en producción, redirigir a la URL de destino si coincide con los criterios
    if (ipRegex.test(hostname) || pagesDevRegex.test(hostname)) {
      redirectToDestination(pathname);
    } /* else {
      console.log('Producción: No se necesita redirección a otro host.');
    } */
  } /* else {
    console.log('Desarrollo: No se necesita redirección.');
  } */
}

// Comprobación inicial de query params
const urlObj = new URL(inputURL);
if (urlObj.search || !isDev) {
  // Llamar a la función si hay query params o estamos en producción
  handleRedirect(inputURL);
} /* else {
  console.log('La URL no tiene query params, y no estamos en producción.');
} */
