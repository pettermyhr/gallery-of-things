(function() {
  const isMobile = window.innerWidth <= 768;
  const gallery = document.querySelector('.item-gallery');
  const originalItems = Array.from(gallery.querySelectorAll('.item-gallery__item'));
  let isLoading = false;

  // Initialize Lenis for smooth scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: isMobile ? 'vertical' : 'horizontal',
    wrapper: isMobile ? window : gallery,
    content: isMobile ? document.documentElement : gallery,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Lazy load observer - fade in items when they enter viewport
  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        lazyObserver.unobserve(entry.target);
      }
    });
  }, {
    root: isMobile ? null : gallery,
    rootMargin: '50px',
    threshold: 0.1
  });

  // Observe all gallery items
  function observeItems() {
    document.querySelectorAll('.item-gallery__item:not(.is-visible)').forEach(item => {
      lazyObserver.observe(item);
    });
  }

  // Initial observation
  observeItems();

  function loadMoreItems() {
    if (isLoading) return;
    isLoading = true;

    originalItems.forEach(item => {
      const clone = item.cloneNode(true);
      clone.classList.remove('is-visible');
      gallery.appendChild(clone);
      lazyObserver.observe(clone);
    });

    // Tell Lenis to recalculate dimensions after adding new content
    requestAnimationFrame(() => {
      lenis.resize();
      isLoading = false;
    });
  }

  function checkScroll() {
    if (isMobile) {
      const scrollTop = lenis.scroll;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (scrollTop + windowHeight >= documentHeight - 800) {
        loadMoreItems();
      }
    } else {
      const scrollLeft = lenis.scroll;
      const containerWidth = gallery.scrollWidth;
      const viewportWidth = gallery.clientWidth;
      
      if (scrollLeft + viewportWidth >= containerWidth - 800) {
        loadMoreItems();
      }
    }
  }

  // Check on Lenis scroll event
  lenis.on('scroll', checkScroll);

  // Initial check - load some content upfront
  loadMoreItems();
  loadMoreItems();

  // Handle resize
  let wasIsMobile = isMobile;
  window.addEventListener('resize', () => {
    const nowIsMobile = window.innerWidth <= 768;
    if (nowIsMobile !== wasIsMobile) {
      location.reload();
    }
  });
})();
