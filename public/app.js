const search = document.querySelector('#search');
if (search) {
  const books = [...document.querySelectorAll('[data-search]')];
  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    books.forEach(book => { book.hidden = !book.dataset.search.includes(query); });
    const count = books.filter(book => !book.hidden).length;
    document.querySelector('#empty').hidden = count !== 0;
    document.querySelector('#search-status').textContent = `${count} ${count === 1 ? 'story' : 'stories'} found`;
  });
}
const size = document.querySelector('#text-size');
const reader = document.querySelector('[data-chapter]');
const resume = document.querySelector('#resume');
// Reading still works when browser storage is unavailable or disabled.
try {
  if (reader) localStorage.setItem('breezer:last', JSON.stringify({url: location.pathname, chapter: reader.dataset.chapter, book: reader.dataset.book}));
  if (size) {
    size.value = ['regular','large','larger'].includes(localStorage.getItem('breezer:size')) ? localStorage.getItem('breezer:size') : 'regular';
    reader.dataset.size = size.value;
  }
  if (resume) {
    const last = JSON.parse(localStorage.getItem('breezer:last') || 'null');
    if (last && /^\/stories\/[a-z0-9-]+\/[a-z0-9-]+\/$/.test(last.url) && typeof last.chapter === 'string' && typeof last.book === 'string') {
      resume.href = last.url;
      resume.textContent = `Pick up where you left off: ${last.book} — ${last.chapter} →`;
      resume.hidden = false;
    }
  }
} catch { /* Storage is optional. */ }
size?.addEventListener('change', () => {
  reader.dataset.size = size.value;
  try { localStorage.setItem('breezer:size', size.value); } catch { /* Storage is optional. */ }
});
