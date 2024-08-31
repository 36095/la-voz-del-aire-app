function getMp3StreamTitle(streamUrl) {
  return new Promise((resolve, reject) => {
    const userAgent =
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36';
    const xhr = new XMLHttpRequest();

    xhr.open(
      'GET',
      'https://zenoplay.zenomedia.com/api/zenofm/nowplaying/dd1qw8bvbmavv',
      true
    );
    xhr.setRequestHeader('Icy-MetaData', '1');
    xhr.setRequestHeader('User-Agent', userAgent);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response.title || ''); // Devuelve el valor de `title` o una cadena vacía si no está presente
          } catch (e) {
            reject('Error parsing JSON');
          }
        } else {
          reject(`Request failed with status ${xhr.status}`);
        }
      }
    };

    xhr.onerror = function () {
      reject('Network error');
    };

    xhr.send();
  });
}

function handleRequest(event) {
  event.preventDefault();

  const url = document.querySelector('input[name="url"]').value;
  if (url) {
    getMp3StreamTitle(url)
      .then((title) => {
        console.log(title);
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    console.log('');
  }
}

document.querySelector('form').addEventListener('submit', handleRequest);
