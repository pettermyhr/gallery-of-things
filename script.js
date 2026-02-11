(function() {
  // Initialize Lenis smooth scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  const gallery = document.querySelector('.gallery');
  const originalItems = Array.from(gallery.querySelectorAll('.gallery__item'));
  let isLoading = false;

  // Lazy load observer - fade in items when they enter viewport
  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        lazyObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '50px',
    threshold: 0.1
  });

  // Observe all gallery items
  function observeItems() {
    document.querySelectorAll('.gallery__item:not(.is-visible)').forEach(item => {
      lazyObserver.observe(item);
    });
  }

  // Initial observation
  observeItems();

  // Infinite scroll - load more items
  function loadMoreItems() {
    if (isLoading) return;
    isLoading = true;

    originalItems.forEach(item => {
      const clone = item.cloneNode(true);
      clone.classList.remove('is-visible');
      gallery.appendChild(clone);
      lazyObserver.observe(clone);
    });

    isLoading = false;
  }

  function handleScroll() {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    if (scrollTop + windowHeight >= documentHeight - 500) {
      loadMoreItems();
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
})();
