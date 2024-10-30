const viewBtn = document.querySelector('.view-modal'),
  popup = document.querySelector('.popup'),
  close = popup.querySelector('.close'),
  field = popup.querySelector('.field'),
  input = field.querySelector('input'),
  copy = field.querySelector('button');

const icons = popup.querySelector('a:not(#global_share)');

viewBtn.onclick = () => {
  popup.classList.toggle('show');
};
close.onclick = () => {
  viewBtn.click();
};
icons.onclick = () => {
  viewBtn.click();
};

copy.onclick = () => {
  input.select(); //select input value
  if (document.execCommand('copy')) {
    //if the selected text is copied
    field.classList.add('active');
    copy.innerText = 'Copiado';
    setTimeout(() => {
      window.getSelection().removeAllRanges(); //remove selection from page
      field.classList.remove('active');
      copy.innerText = 'Copiar';
    }, 3000);
  }
};

const shareData = {
  title: 'La Voz Del Aire',
  text: '¡Escucha la radio online La Voz Del Aire del Ministerio Tiempo de Un Nuevo Comienzo!\n📻',
  url: 'https://tunc.cl',
};

const btn = popup.querySelector('a#global_share');
// const resultPara = document.querySelector('.result');

// Share must be triggered by "user activation"
btn.addEventListener('click', async (e) => {
  // e.preventDefault();
  try {
    await navigator.share(shareData);
    // resultPara.textContent = 'MDN shared successfully';
  } catch (err) {
    // resultPara.textContent = `Error: ${err}`;
  }
});
