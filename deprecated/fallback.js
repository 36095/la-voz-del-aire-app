function setHeaders() {
  const headers = {
    'Content-Type': 'text/plain',
    Pragma: 'public',
    Expires: 'Sat, 26 Jul 1997 05:00:00 GMT',
    'Last-Modified': new Date().toUTCString(),
    'Cache-Control':
      'no-store, no-cache, must-revalidate, pre-check=0, post-check=0, max-age=0',
    Pragma: 'no-cache',
    Expires: '0',
  };

  for (const [key, value] of Object.entries(headers)) {
    document
      .querySelector('meta[name="' + key + '"]')
      .setAttribute('content', value);
  }
}

function useFileGetContents(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      'GET',
      'https://zenoplay.zenomedia.com/api/zenofm/nowplaying/dd1qw8bvbmavv',
      true
    );
    xhr.setRequestHeader('Accept-language', 'en');
    xhr.setRequestHeader('Cookie', 'foo=bar');
    xhr.setRequestHeader(
      'User-Agent',
      'Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.102011-10-16 20:23:10'
    );

    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        resolve(''); // Handle empty response
      }
    };

    xhr.onerror = function () {
      reject('Network error');
    };

    xhr.send();
  });
}

function useCurl(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader(
      'User-Agent',
      'Mozilla/5.0 (Windows NT 6.1; rv:8.0) Gecko/20100101 Firefox/8.0'
    );

    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        resolve('The file you requested could not be found');
      }
    };

    xhr.onerror = function () {
      reject('Network error');
    };

    xhr.send();
  });
}

document.querySelector('form').addEventListener('submit', function (event) {
  event.preventDefault();

  const url = document.querySelector('input[name="url"]').value;

  if (url) {
    useCurl(url)
      .then((output) => {
        if (
          output === '' ||
          output === 'The file you requested could not be found'
        ) {
          return useFileGetContents(url);
        }
        return output;
      })
      .then((output) => {
        console.log(output);
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

// Llamada inicial para establecer los headers en la respuesta
setHeaders();
