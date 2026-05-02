'use strict';

const modal    = document.getElementById('imageModal');
const modalImg = document.getElementById('img01');
const capTitle = document.getElementById('capTitle');
const capCount = document.getElementById('capCount');
const btnClose = modal.querySelector('.modal-close');
const btnPrev  = modal.querySelector('.modal-prev');
const btnNext  = modal.querySelector('.modal-next');

let currentIndex  = 0;
let currentImages = [];

function getGroupImages(group) {
  return Array.from(
    document.querySelectorAll(`.gallery-card[data-group="${group}"]`)
  ).map(card => {
    const img = card.querySelector('img');
    return { src: img.src, alt: img.alt };
  });
}

function render() {
  const item = currentImages[currentIndex];
  modalImg.src = item.src;
  modalImg.alt = item.alt;
  capTitle.textContent = item.alt;
  capCount.textContent = `${currentIndex + 1} / ${currentImages.length}`;
}

function openModal(group, index) {
  currentImages = getGroupImages(group);
  currentIndex  = index;
  render();
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  btnClose.focus();
}

function closeModal() {
  modal.setAttribute('aria-hidden', 'true');
  modalImg.src = '';
  document.body.style.overflow = '';
}

function next() {
  currentIndex = (currentIndex + 1) % currentImages.length;
  render();
}

function prev() {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  render();
}

document.querySelectorAll('.gallery-card').forEach(card => {
  card.addEventListener('click', () => {
    openModal(card.dataset.group, parseInt(card.dataset.index));
  });
});

btnClose.addEventListener('click', closeModal);
btnNext.addEventListener('click', next);
btnPrev.addEventListener('click', prev);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

document.addEventListener('keydown', e => {
  if (modal.getAttribute('aria-hidden') === 'true') return;
  if (e.key === 'Escape')     closeModal();
  if (e.key === 'ArrowLeft')  next();
  if (e.key === 'ArrowRight') prev();
});

let startX = 0, startY = 0, swiping = false;
modal.addEventListener('touchstart', e => {
  const t = e.touches[0]; startX = t.clientX; startY = t.clientY; swiping = true;
}, { passive: true });
modal.addEventListener('touchmove', e => {
  if (!swiping) return;
  const dx = e.touches[0].clientX - startX;
  const dy = e.touches[0].clientY - startY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) e.preventDefault();
}, { passive: false });
modal.addEventListener('touchend', e => {
  if (!swiping) return; swiping = false;
  const dx = e.changedTouches[0].clientX - startX;
  const dy = e.changedTouches[0].clientY - startY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
    dx < 0 ? next() : prev();
  }
}, { passive: true });
