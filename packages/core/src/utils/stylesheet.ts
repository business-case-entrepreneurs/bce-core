export const injectCSS = (id: string, css: string | string[]) => {
  const rules = typeof css === 'string' ? css : css.join('\n');
  const sheet = document.createElement('style');
  sheet.dataset.target = id;
  sheet.type = 'text/css';
  sheet.appendChild(document.createTextNode(`\n${rules}\n`));

  removeCSS(id);
  document.head.appendChild(sheet);
};

export const removeCSS = (id: string) => {
  const sheet = document.querySelector(`style[data-target='${id}']`);
  if (sheet) document.head.removeChild(sheet);
};
