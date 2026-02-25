(function() {
  const gallery = document.querySelector('.gallery');
  
  const originalItems = Array.from(gallery.querySelectorAll('.gallery__item'));

  originalItems.forEach(item => {
    const img = item.querySelector('img');
    function check() {
      if (img.naturalWidth > img.naturalHeight) {
        item.classList.add('gallery__item--landscape');
      }
    }
    if (img.complete && img.naturalWidth) {
      check();
    } else {
      img.addEventListener('load', check);
    }
  });

  let isLoadingTop = false;
  let isLoadingBottom = false;
  let lenis = null;

  // Lazy load observer
  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        lazyObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '100px',
    threshold: 0.1
  });

  function observeItems() {
    document.querySelectorAll('.gallery__item:not(.is-visible)').forEach(item => {
      lazyObserver.observe(item);
    });
  }

  function cloneItems() {
    const fragment = document.createDocumentFragment();
    [...originalItems].forEach(item => {
      const clone = item.cloneNode(true);
      clone.classList.remove('is-visible');
      fragment.appendChild(clone);
    });
    return fragment;
  }

  function prependItems() {
    if (isLoadingTop) return;
    isLoadingTop = true;

    // Stop Lenis during prepend
    if (lenis) lenis.stop();

    const scrollY = window.scrollY;
    const firstItem = gallery.firstElementChild;
    const offsetBefore = firstItem ? firstItem.offsetTop : 0;

    gallery.insertBefore(cloneItems(), gallery.firstChild);

    // Adjust scroll to compensate for added height
    requestAnimationFrame(() => {
      const offsetAfter = firstItem ? firstItem.offsetTop : 0;
      const diff = offsetAfter - offsetBefore;
      window.scrollTo(0, scrollY + diff);
      
      // Resume Lenis and update its scroll position
      if (lenis) {
        lenis.start();
        lenis.resize();
      }
      
      observeItems();
      isLoadingTop = false;
    });
  }

  function appendItems() {
    if (isLoadingBottom) return;
    isLoadingBottom = true;

    gallery.appendChild(cloneItems());

    requestAnimationFrame(() => {
      if (lenis) lenis.resize();
      observeItems();
      isLoadingBottom = false;
    });
  }

  function checkScroll() {
    const scrollTop = lenis ? lenis.scroll : window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    if (scrollTop + windowHeight >= documentHeight - 1000) {
      appendItems();
    }
    
    if (scrollTop < 1000) {
      prependItems();
    }
  }

  function init() {
    // Build initial content: 3 sets above, original, 3 sets below
    for (let i = 0; i < 3; i++) {
      gallery.insertBefore(cloneItems(), gallery.firstChild);
    }
    for (let i = 0; i < 3; i++) {
      gallery.appendChild(cloneItems());
    }

    // Wait for layout, then scroll to center second row of middle section
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const items = gallery.querySelectorAll('.gallery__item');
        const columns = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--gallery-columns')) || 5;
        
        // Middle section starts at index: 3 sets * 10 items = 30
        // Second row of middle section: 30 + columns
        const targetIndex = (3 * originalItems.length) + columns;
        const targetItem = items[targetIndex];
        
        if (targetItem) {
          const rect = targetItem.getBoundingClientRect();
          const scrollTarget = targetItem.offsetTop - (window.innerHeight / 2) + (rect.height / 2);
          window.scrollTo(0, scrollTarget);
        }

        // Initialize Lenis smooth scroll
        lenis = new Lenis({
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

        lenis.on('scroll', checkScroll);
        observeItems();
      });
    });
  }

  init();
})();
