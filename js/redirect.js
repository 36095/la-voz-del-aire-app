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

// Función para redirigir si estamos en producción
function redirectToDestination(pathname) {
  const newURL = `${destination}${pathname}`;
  console.log('Redirigiendo a producción:', newURL);
  window.location.replace(newURL);
}

// Función principal que maneja la lógica de redirección y eliminación de query params
function handleRedirect(url) {
  const urlObj = new URL(url);
  const hostname = urlObj.hostname;
  const pathname = urlObj.pathname;

  // Siempre eliminar los query params no deseados si están presentes
  if (hasUnwantedParams(url)) {
    const cleanedURLObj = removeUnwantedParams(url);
    const cleanedURL = `${window.location.origin}${pathname}${cleanedURLObj.search}`;

    if (!isDev) {
      // Si estamos en producción, verificar si el host coincide con los criterios antes de redirigir
      if (ipRegex.test(hostname) || pagesDevRegex.test(hostname)) {
        redirectToDestination(pathname); // Redirigir a destino si es una IP o dominio pages.dev
      } else {
        console.log(
          'Producción: Redirigiendo a la misma URL sin query params no deseados.'
        );
        window.location.replace(cleanedURL); // Redirigir a la misma URL sin los query params
      }
    } else {
      // En desarrollo, simplemente redirigir a la misma URL sin los query params
      console.log(
        'Modo desarrollo: Redirigiendo a la misma URL sin query params no deseados.'
      );
      window.location.replace(cleanedURL);
    }
  } else if (
    !isDev &&
    (ipRegex.test(hostname) || pagesDevRegex.test(hostname))
  ) {
    // Si estamos en producción, siempre redirigir al destino si el host coincide
    redirectToDestination(pathname);
  } else {
    console.log('No se necesita redirección.');
  }
}

// Comprobación inicial de query params
const urlObj = new URL(inputURL);
if (urlObj.search || !isDev) {
  // Llamar a la función si hay query params o estamos en producción
  handleRedirect(inputURL);
} else {
  console.log('La URL no tiene query params, y no estamos en producción.');
}
