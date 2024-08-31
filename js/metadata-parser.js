const METADATA_URL =
  'https://api.zeno.fm/mounts/metadata/subscribe/dd1qw8bvbmavv';
const SONG_TITLE_ELEMENT = 'div>marquee.cc_streaminfo[data-type="song"]';
const SONG_TITLE_ELEMENT2 = 'div>marquee.cc_streaminfo2[data-type="song"]';
const SONG_COVER_ELEMENT = 'none';

const eventSource = new EventSource(METADATA_URL);

function normalizeTitle(title) {
  return title
    .normalize('NFD') // Descomponer caracteres con acentos
    .replace(/[\u0300-\u036f]/g, '') // Eliminar marcas diacríticas (acentos)
    .replace(/[^\w\s]/g, '') // Eliminar todos los caracteres especiales incluyendo guiones
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .toLowerCase(); // Convertir a minúsculas
}
const $songElement = document.querySelector(SONG_TITLE_ELEMENT);
const $songElement2 = document.querySelector(SONG_TITLE_ELEMENT2);
const $htmlTitle = document.querySelector('html>head>title');
const $imgElement = document.querySelector(SONG_COVER_ELEMENT);

eventSource.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);

  if (data.streamTitle) {
    if ($songElement) $songElement.textContent = `${data.streamTitle}`;
    if ($songElement2) $songElement2.textContent = `${data.streamTitle}`;
    if ($htmlTitle)
      $htmlTitle.textContent = `La Voz Del Aire — ${data.streamTitle}`;
  }
  if ($imgElement === 'none' || !$imgElement) {
    return;
  } else {
    if (data.streamTitle) {
      const normalizedTitle = normalizeTitle(data.streamTitle);
      $imgElement.src = `../img/covers/${normalizedTitle}.png`;
    }
  }
});

eventSource.addEventListener('ping', () => {
  console.log('Ping received');
});

eventSource.onerror = (error) => {
  console.error('Error in connection:', error);
  $songElement.textContent = 'La Voz Del Aire Radio';
};
