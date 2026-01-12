/**
 * LaLa GLOBAL LANGUAGE - スペイン語LP
 * JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
  // スムーススクロール
  initSmoothScroll();

  // スクロールアニメーション
  initScrollAnimations();

  // ヘッダーのスクロール時の挙動
  initHeaderScroll();

  // 固定CTAの表示制御
  initFixedCTA();
});

/**
 * スムーススクロール
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * スクロールアニメーション（Intersection Observer）
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.problem-card, .affinity-card, .solution-card, .benefit-item, ' +
    '.voice-card, .lesson-type-card, .class-type-card, .stat-item'
  );

  // 初期状態を設定
  animatedElements.forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, index) {
      if (entry.isIntersecting) {
        // 遅延を追加してカスケード効果を出す
        const delay = getElementDelay(entry.target);

        setTimeout(function() {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(function(el) {
    observer.observe(el);
  });
}

/**
 * 要素の遅延時間を計算
 */
function getElementDelay(element) {
  const parent = element.parentElement;

  if (parent) {
    const siblings = Array.from(parent.children).filter(function(child) {
      return child.classList.contains(element.classList[0]);
    });

    const index = siblings.indexOf(element);
    return index * 100;
  }

  return 0;
}

/**
 * ヘッダーのスクロール時の挙動
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  let lastScrollTop = 0;
  let ticking = false;

  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        handleHeaderScroll(header, lastScrollTop);
        lastScrollTop = window.pageYOffset;
        ticking = false;
      });

      ticking = true;
    }
  });
}

function handleHeaderScroll(header, lastScrollTop) {
  const scrollTop = window.pageYOffset;

  // スクロール量が100px以上の場合、ヘッダーに影を追加
  if (scrollTop > 100) {
    header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
  } else {
    header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
  }
}

/**
 * 固定CTAの表示制御
 */
function initFixedCTA() {
  const fixedCTA = document.querySelector('.fixed-cta');
  const hero = document.querySelector('.hero');
  const footer = document.querySelector('.footer');

  if (!fixedCTA || !hero) return;

  let ticking = false;

  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        handleFixedCTAVisibility(fixedCTA, hero, footer);
        ticking = false;
      });

      ticking = true;
    }
  });

  // 初期状態をチェック
  handleFixedCTAVisibility(fixedCTA, hero, footer);
}

function handleFixedCTAVisibility(fixedCTA, hero, footer) {
  const scrollTop = window.pageYOffset;
  const heroBottom = hero.offsetTop + hero.offsetHeight;
  const footerTop = footer ? footer.offsetTop - window.innerHeight : Infinity;

  // ヒーローセクションを過ぎたら表示、フッター付近で非表示
  if (scrollTop > heroBottom && scrollTop < footerTop) {
    fixedCTA.style.transform = 'translateY(0)';
    fixedCTA.style.opacity = '1';
  } else {
    fixedCTA.style.transform = 'translateY(100%)';
    fixedCTA.style.opacity = '0';
  }
}

/**
 * カウントアップアニメーション（オプション）
 */
function animateCountUp(element, target, duration) {
  const start = 0;
  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = easeOutQuart(progress);
    const current = Math.floor(start + (target - start) * easeProgress);

    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(updateCount);
}

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

/**
 * 統計数値のカウントアップアニメーション
 */
function initStatCountUp() {
  const statNumbers = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const isPercentage = text.includes('%');
        const number = parseInt(text.replace(/[^0-9]/g, ''), 10);

        if (!isNaN(number)) {
          animateCountUp(el, number, 1500);

          if (isPercentage) {
            el.textContent = '0%';
            setTimeout(function() {
              el.textContent = number + '%';
            }, 1500);
          }
        }

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(function(el) {
    observer.observe(el);
  });
}

// 統計カウントアップを初期化
document.addEventListener('DOMContentLoaded', initStatCountUp);
