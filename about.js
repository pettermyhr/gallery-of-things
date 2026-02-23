(function() {
  // Collapse buttons (accordion)
  const collapseGroup = document.querySelector('.collapse-group');
  const collapseBtns = document.querySelectorAll('.collapse-btn');

  collapseBtns.forEach(btn => {
    const header = btn.querySelector('.collapse-btn__header');
    
    header.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      
      // Close all other buttons
      collapseBtns.forEach(otherBtn => {
        otherBtn.setAttribute('aria-expanded', 'false');
      });
      
      // Toggle current button
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        collapseGroup.classList.add('has-open');
      } else {
        collapseGroup.classList.remove('has-open');
      }
    });
  });
  // Image slideshow
  const slides = document.querySelectorAll('.about__image-slide');
  let currentSlide = 0;

  if (slides.length > 1) {
    setInterval(() => {
      slides[currentSlide].classList.remove('is-active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('is-active');
    }, 10000);
  }
})();
