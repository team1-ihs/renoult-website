
(function initThemeFromStorage() {
  try {
    const saved = localStorage.getItem('renoult-theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    if (saved === 'light' || (!saved && prefersLight)) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  } catch (_) {}
})();

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('[data-theme-toggle]');
  if (btn) {
    btn.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light');
      try { localStorage.setItem('renoult-theme', isLight ? 'light' : 'dark'); } catch (_) {}
    });
  }

  document.querySelector('[data-wa]')?.addEventListener('click',(e)=>{
    e.preventDefault();
    alert('Please try connecting on the number we have provided on the page.');
  });

  const track = document.querySelector('.scroll-track');
  const dotsWrap = document.querySelector('.dots');
  if (track && dotsWrap){
    const slides = Array.from(track.querySelectorAll('.slide'));
    dotsWrap.innerHTML = slides.map((_,i)=>`<button class="dot" data-i="${i}" aria-label="Go to slide ${i+1}"></button>`).join('');
    const dots = Array.from(dotsWrap.querySelectorAll('.dot'));
    const setActive = (idx)=> dots.forEach((d,i)=> d.classList.toggle('active', i===idx));
    const go = (idx)=> track.scrollTo({left: idx*track.clientWidth, behavior:'smooth'});
    dots.forEach(d => d.addEventListener('click', ()=> go(+d.dataset.i)));
    const onScroll = ()=> setActive(Math.round(track.scrollLeft/track.clientWidth));
    track.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
    onScroll();

    let isDown=false, startX=0, startLeft=0;
    track.addEventListener('pointerdown', (e)=>{ isDown=true; startX=e.pageX - track.offsetLeft; startLeft=track.scrollLeft; track.setPointerCapture(e.pointerId); });
    track.addEventListener('pointermove', (e)=>{ if(!isDown) return; const x=e.pageX-track.offsetLeft; track.scrollLeft = startLeft - (x-startX); });
    window.addEventListener('pointerup', ()=> isDown=false);
  }

  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',(e)=>{
      const id = a.getAttribute('href');
      if (id.length>1){
        e.preventDefault();
        document.querySelector(id)?.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', () => {
      const target = link.getAttribute('data-nav');
      if (!location.pathname.endsWith('/index.html') && !location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html' + target;
      }
    });
  });
});

// HERO SLIDER
const slides = document.querySelectorAll('.slide');
const slidesWrap = document.querySelector('.slides');
const prev = document.querySelector('.slider-arrow.prev');
const next = document.querySelector('.slider-arrow.next');
const dotsWrap = document.querySelector('.slider-dots');

let index = 0;

// Create dots
slides.forEach((_, i) => {
  const dot = document.createElement('span');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsWrap.appendChild(dot);
});

const dots = dotsWrap.querySelectorAll('span');

function goToSlide(i) {
  index = i;
  slidesWrap.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach(d => d.classList.remove('active'));
  dots[index].classList.add('active');
}

next.addEventListener('click', () => {
  index = (index + 1) % slides.length;
  goToSlide(index);
});

prev.addEventListener('click', () => {
  index = (index - 1 + slides.length) % slides.length;
  goToSlide(index);
});

// Auto slide (optional)
setInterval(() => {
  index = (index + 1) % slides.length;
  goToSlide(index);
}, 6000);
