(function() {
  const gallery = document.querySelector('.item-gallery');
  const originalItems = Array.from(gallery.querySelectorAll('.item-gallery__item'));
  let isLoading = false;
  let lenis = null;
  let lazyObserver = null;
  let isTabletOrMobile = window.innerWidth <= 1024;

  function createLenis() {
    if (lenis) {
      lenis.destroy();
    }

    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: isTabletOrMobile ? 'vertical' : 'horizontal',
      wrapper: isTabletOrMobile ? window : gallery,
      content: isTabletOrMobile ? document.documentElement : gallery,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2
    });

    lenis.on('scroll', checkScroll);
  }

  function createLazyObserver() {
    if (lazyObserver) {
      lazyObserver.disconnect();
    }

    lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          lazyObserver.unobserve(entry.target);
        }
      });
    }, {
      root: isTabletOrMobile ? null : gallery,
      rootMargin: '50px',
      threshold: 0.1
    });

    // Observe items that aren't visible yet
    document.querySelectorAll('.item-gallery__item:not(.is-visible)').forEach(item => {
      lazyObserver.observe(item);
    });
  }

  function loadMoreItems() {
    if (isLoading) return;
    isLoading = true;

    originalItems.forEach(item => {
      const clone = item.cloneNode(true);
      clone.classList.remove('is-visible');
      gallery.appendChild(clone);
      if (lazyObserver) {
        lazyObserver.observe(clone);
      }
    });

    requestAnimationFrame(() => {
      if (lenis) lenis.resize();
      isLoading = false;
    });
  }

  function checkScroll() {
    if (isTabletOrMobile) {
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

  function raf(time) {
    if (lenis) lenis.raf(time);
    requestAnimationFrame(raf);
  }

  // Initialize
  createLenis();
  createLazyObserver();
  requestAnimationFrame(raf);

  // Initial content load
  loadMoreItems();
  loadMoreItems();

  // Handle resize - reinitialize without reload
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const nowIsTabletOrMobile = window.innerWidth <= 1024;
      if (nowIsTabletOrMobile !== isTabletOrMobile) {
        isTabletOrMobile = nowIsTabletOrMobile;
        
        // Reset scroll position
        window.scrollTo(0, 0);
        gallery.scrollLeft = 0;
        
        // Reinitialize Lenis and observer
        createLenis();
        createLazyObserver();
      }
    }, 150);
  });
})();
