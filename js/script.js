// ── COUNTER ANIMATION (شمارنده آمار) ──
function animCount(el, target, suffix) {
  let t0 = null;
  const dur = 1800;
  const tick = ts => {
    if (!t0) t0 = ts;
    const p = Math.min((ts - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const statsEl = document.querySelector('.hero-stats');
if (statsEl) {
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animCount(document.getElementById('s1'), 3000, '+');
      animCount(document.getElementById('s2'), 15, '+');
    }
  }, { threshold: .5 }).observe(statsEl);
}

// ── REVEAL ON SCROLL (نمایش تدریجی هنگام اسکرول) ──
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    }
  });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── SLIDESHOW برای سایت RTL (راست‌چین) ──
(function() {
  const track = document.getElementById('slideTrack');
  const dotsWrap = document.getElementById('slideDots');
  const prevBtn = document.getElementById('slidePrev');
  const nextBtn = document.getElementById('slideNext');
  
  if (!track) {
    console.error('slideTrack پیدا نشد!');
    return;
  }
  
  const slides = track.querySelectorAll('.slide');
  const total = slides.length;
  let currentIndex = 0;
  let autoTimer;
  
  console.log('اسلایدشو راه‌اندازی شد (RTL) - تعداد:', total);
  
  function goTo(index) {
    currentIndex = (index + total) % total;
    // در RTL: مقدار مثبت = حرکت به راست
    const translateValue = currentIndex * 100;
    track.style.transform = 'translateX(' + translateValue + '%)';
    console.log('رفتن به اسلاید:', currentIndex, 'translateX:', translateValue + '%');
    
    // به‌روزرسانی دات‌ها
    if (dotsWrap) {
      const dots = dotsWrap.querySelectorAll('.slide-dot');
      dots.forEach(function(dot, i) {
        if (i === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  }
  
  // در RTL:
  // nextSlide = اسلاید بعدی (به راست) = کاهش currentIndex
  // prevSlide = اسلاید قبلی (به چپ) = افزایش currentIndex
  
  function nextSlide() {
    goTo(currentIndex - 1);  // حرکت به راست (اسلاید بعدی)
    resetTimer();
  }
  
  function prevSlide() {
    goTo(currentIndex + 1);  // حرکت به چپ (اسلاید قبلی)
    resetTimer();
  }
  
  function resetTimer() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(nextSlide, 4000);  // خودکار: هر 4 ثانیه به راست
  }
  
  // ساخت دات‌ها
  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'slide-dot';
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', (function(idx) {
        return function() { goTo(idx); resetTimer(); };
      })(i));
      dotsWrap.appendChild(dot);
    }
  }
  
  // رویدادهای دکمه‌ها - برعکس شده
  // دکمه راست (←) که id="slideNext" است → باید اسلاید قبلی را نشان دهد
  // دکمه چپ (→) که id="slidePrev" است → باید اسلاید بعدی را نشان دهد
  if (prevBtn) prevBtn.addEventListener('click', nextSlide);   // دکمه چپ (→) ← اسلاید بعدی
  if (nextBtn) nextBtn.addEventListener('click', prevSlide);   // دکمه راست (←) ← اسلاید قبلی
  
  // شروع اتوماتیک
  resetTimer();
  
  // توقف هنگام هاور
  const wrap = document.querySelector('.slideshow-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', function() { clearInterval(autoTimer); });
    wrap.addEventListener('mouseleave', resetTimer);
  }
})();