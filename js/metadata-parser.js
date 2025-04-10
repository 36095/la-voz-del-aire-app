const METADATA_URL =
  'https://api.zeno.fm/mounts/metadata/subscribe/dd1qw8bvbmavv';
const SONG_TITLE_ELEMENT = 'div>.cc_streaminfo[data-type="song"]';
const SONG_TITLE_ELEMENT2 = 'div>.cc_streaminfo2[data-type="song"]';
const SONG_COVER_ELEMENT = '.cover-img-container';

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
    if ($htmlTitle) $htmlTitle.textContent = `${data.streamTitle}`;
  }
  if ($imgElement === 'none' || !$imgElement) {
    return;
  } else {
    if (data.streamTitle) {
      const normalizedTitle = normalizeTitle(data.streamTitle);
      const extensions = ['jpg', 'png'];

      Promise.allSettled(
        extensions.map((ext) =>
          fetch(`/img/local-covers/${normalizedTitle}.${ext}`)
        )
      ).then((results) => {
        for (let i = 0; i < results.length; i++) {
          if (
            results[i].status === 'fulfilled' &&
            results[i].value.status === 200
          ) {
            $imgElement.src = `/img/local-covers/${normalizedTitle}.${extensions[i]}`;
            return;
          }
        }
        console.error(
          `Error fetching cover for "${normalizedTitle}": No valid image found`
        );
        $imgElement.src = '/img/colorful_logo_256x256.webp'; // Imagen por defecto
      });
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
