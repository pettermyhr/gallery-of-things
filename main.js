(function() {
  // Page transition - fade in
  document.body.classList.add('is-loaded');

  // Page transition - fade out on link click
  document.querySelectorAll('a[href]').forEach(link => {
    if (link.hostname === window.location.hostname && !link.hash && !link.href.startsWith('mailto:')) {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          e.preventDefault();
          document.body.classList.remove('is-loaded');
          document.body.classList.add('is-leaving');
          setTimeout(() => {
            window.location.href = href;
          }, 500);
        }
      });
    }
  });

  // Menu toggle
  const menu = document.querySelector('.menu');
  const menuToggle = document.querySelector('.menu__toggle');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (menu && !menu.contains(e.target) && menu.classList.contains('is-open')) {
      menu.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', false);
    }
  });
})();
