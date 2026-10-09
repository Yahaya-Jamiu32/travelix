(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const toastEl = $('#toast'); let tt;
  const toast = (m) => { toastEl.textContent = m; toastEl.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove('show'), 2600); };

  // mobile menu
  const burger = $('#burger'), menu = $('#menu');
  const setMenu = (open) => { menu.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a,button')) setMenu(false); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.bar')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // search tabs
  let mode = 'Trips';
  $$('.tabs [role=tab]').forEach((t) => t.addEventListener('click', () => {
    $$('.tabs [role=tab]').forEach((x) => x.setAttribute('aria-selected', x === t));
    mode = t.dataset.mode; $('#goBtn span').textContent = 'Search ' + mode;
  }));

  // dates
  const dep = $('#dep'), ret = $('#ret'), today = new Date().toISOString().slice(0, 10);
  dep.min = ret.min = today;
  dep.addEventListener('change', () => { ret.min = dep.value || today; });

  // filter destinations
  const cards = $$('#grid .card'), empty = $('#empty'), note = $('#note');
  const defNote = note.textContent;
  function filter(q) {
    q = q.trim().toLowerCase(); let n = 0;
    cards.forEach((c) => { const ok = !q || c.dataset.s.includes(q); c.hidden = !ok; if (ok) n++; });
    empty.hidden = n > 0;
    empty.textContent = n ? '' : `No destinations match “${q}” yet. Try Santorini, Bali, Paris or Maldives.`;
    note.textContent = q ? `${n} destination${n === 1 ? '' : 's'} for “${q}”.` : defNote;
    return n;
  }
  $('#viewAll').addEventListener('click', () => { $('#where').value = ''; filter(''); toast('Showing all destinations'); });

  $('#search').addEventListener('submit', (e) => {
    e.preventDefault();
    const err = $('#dateErr'), bad = dep.value && ret.value && ret.value <= dep.value;
    err.hidden = !bad; if (bad) { ret.focus(); return; }
    const n = filter($('#where').value);
    $('#destinations').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
    toast(n ? `${mode}: ${$('#trv').value}${dep.value ? ', ' + dep.value : ''}` : 'No matching destinations');
  });

  // plan a trip from a card
  $$('[data-dest]').forEach((a) => a.addEventListener('click', () => {
    $('#where').value = a.dataset.dest; setTimeout(() => $('#where').focus({ preventScroll: true }), 400);
    toast(`${a.dataset.dest} added to your trip`);
  }));
  $$('a[href="#plan"]').forEach((a) => { if (!a.dataset.dest) a.addEventListener('click', () => setTimeout(() => $('#where').focus({ preventScroll: true }), 500)); });

  // favourites
  $$('.fav').forEach((b) => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on);
    toast(on ? 'Saved to favorites' : 'Removed from favorites');
  }));

  // login dialog
  const dlg = $('#login'), form = $('#loginForm');
  $$('[data-login]').forEach((b) => b.addEventListener('click', () => { dlg.showModal(); $('#le').focus(); }));
  $('#closeLogin').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  form.addEventListener('submit', (e) => {
    e.preventDefault(); dlg.classList.add('tried');
    if (!form.checkValidity()) return;
    $('#loginOk').hidden = false;
    setTimeout(() => { dlg.close(); form.reset(); dlg.classList.remove('tried'); $('#loginOk').hidden = true; toast('Logged in (demo)'); }, 900);
  });
})();
