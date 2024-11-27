function openOverlay(img) {
    const overlay = document.getElementById('overlay');
    const overlayImage = document.getElementById('overlay-image');
  
    // Setzt das Bild im Overlay
    overlayImage.src = img.src;
  
    // Zeigt das Overlay an
    overlay.style.display = 'flex';
    overlay.style.opacity = '1';
  }
  
  function closeOverlay() {
    const overlay = document.getElementById('overlay');
  
    // Versteckt das Overlay mit einer Verzögerung für die Animation
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 500); // Die Zeit muss mit der CSS-Transition übereinstimmen
  }


  function nextSlide(button) {
    const slider = button.closest('.slider');
    const slides = slider.querySelector('.slides');
    const indicator = slider.querySelector('.slide-indicator');
    const totalSlides = slider.querySelectorAll('.slide').length;

    let currentIndex = parseInt(slides.dataset.currentIndex || 0);

    if (currentIndex < totalSlides - 1) {
        currentIndex++;
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;
        slides.dataset.currentIndex = currentIndex;
    }

    indicator.textContent = `${currentIndex + 1} / ${totalSlides}`;
}

function prevSlide(button) {
    const slider = button.closest('.slider');
    const slides = slider.querySelector('.slides');
    const indicator = slider.querySelector('.slide-indicator');
    const totalSlides = slider.querySelectorAll('.slide').length;

    let currentIndex = parseInt(slides.dataset.currentIndex || 0);

    if (currentIndex > 0) {
        currentIndex--;
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;
        slides.dataset.currentIndex = currentIndex;
    }

    indicator.textContent = `${currentIndex + 1} / ${totalSlides}`;
}
