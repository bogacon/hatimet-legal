const input = document.querySelector('[data-search]');
if (input) {
  input.addEventListener('input', () => {
    const normalize = (value) => value.toLocaleLowerCase('tr').normalize('NFD').replace(/\p{M}/gu, '').replaceAll('ı','i');
    const query = normalize(input.value.trim());
    let count = 0;
    document.querySelectorAll('[data-search-item]').forEach((item) => {
      const matches = normalize(item.textContent).includes(query);
      item.hidden = !matches; if (matches) count++;
    });
    const status = document.querySelector('[data-search-status]');
    if (status) status.textContent = query ? `${count} sonuç` : '';
  });
}
