const groups = {
  events:    Array.from({ length: 15 }, (_, i) => ({ src: `event${i+1}.jpg`,    alt: `אירוע ${i+1}` })),
  workshops: Array.from({ length: 14 }, (_, i) => ({ src: `workshop${i+1}.jpg`, alt: `סדנה ${i+1}` }))
};
const modal    = document.getElementById('imageModal');
const modalImg = document.getElementById('img01');
const capTitle = document.getElementById('capTitle');
const capCount = document.getElementById('capCount');
const btnClose = modal.querySelector('.close');
const btnPrev  = modal.querySelector('.prev');
const btnNext  = modal.querySelector('.next');
let currentGroup = 'events', currentIndex = 0;
function render() {
  const item = groups[currentGroup][currentIndex];
  modalImg.src = item.src; modalImg.alt = item.alt;
  capTitle.textContent = item.alt;
  capCount.textContent = `${currentIndex+1} / ${groups[currentGroup].length}`;
}
function openModal(group, index) {
  currentGroup = group; currentIndex = index; render();
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden'; btnClose.focus();
}
function closeModal() {
  modal.setAttribute('aria-hidden','true');
  modalImg.src = ''; document.body.style.overflow = '';
}
function next() { currentIndex = (currentIndex+1) % groups[currentGroup].length; render(); }
function prev() { currentIndex = (currentIndex-1+groups[currentGroup].length) % groups[currentGroup].length; render(); }
document.querySelectorAll('.gallery-card').forEach(el => {
  el.addEventListener('click', () => openModal(el.dataset.group, Number(el.dataset.index)||0));
});
btnClose.addEventListener('click', closeModal);
btnNext.addEventListener('click', next);
btnPrev.addEventListener('click', prev);
modal.addEventListener('click', e => { if (e.target===modal) closeModal(); });
document.addEventListener('keydown', e => {
  if (modal.getAttribute('aria-hidden')==='true') return;
  if (e.key==='Escape') closeModal();
  if (e.key==='ArrowLeft') next();
  if (e.key==='ArrowRight') prev();
});
let startX=0, startY=0, swiping=false;
modal.addEventListener('touchstart', e => { startX=e.touches[0].clientX; startY=e.touches[0].clientY; swiping=true; }, {passive:true});
modal.addEventListener('touchmove', e => {
  if (!swiping) return;
  const dx=e.touches[0].clientX-startX, dy=e.touches[0].clientY-startY;
  if (Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>10) e.preventDefault();
}, {passive:false});
modal.addEventListener('touchend', e => {
  if (!swiping) return; swiping=false;
  const dx=e.changedTouches[0].clientX-startX;
  if (Math.abs(dx)>40) { if (dx<0) next(); else prev(); }
}, {passive:true});
