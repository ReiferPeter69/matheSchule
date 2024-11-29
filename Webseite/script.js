function openOverlay(img) {
  const overlay = document.getElementById("overlay");
  const overlayImage = document.getElementById("overlay-image");

  // Setzt das Bild im Overlay
  overlayImage.src = img.src;

  // Zeigt das Overlay an
  overlay.style.display = "flex";
  overlay.style.opacity = "1";
}

function closeOverlay() {
  const overlay = document.getElementById("overlay");

  // Versteckt das Overlay mit einer Verzögerung für die Animation
  overlay.style.opacity = "0";
  setTimeout(() => {
    overlay.style.display = "none";
  }, 500); // Die Zeit muss mit der CSS-Transition übereinstimmen
}

function closeOverlayRules() {
  const overlay = document.getElementById("overlayRules");

  // Versteckt das Overlay mit einer Verzögerung für die Animation
  overlay.style.opacity = "0";
  setTimeout(() => {
    overlay.style.display = "none";
  }, 500); // Die Zeit muss mit der CSS-Transition übereinstimmen
}

let index = 0; // Global deklarierte Variable

function overlayRules() {
  let overlay = document.getElementById("overlayRules");

  if (index === 0) {
    overlay.style.display = "flex";
    overlay.style.opacity = "1";
    // Verhindert das Scrollen der Seite im Hintergrund
    document.body.style.overflow = "hidden";
    index++;
  } else {
    // Versteckt das Overlay mit einer Verzögerung für die Animation
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.style.display = "none";
      // Ermöglicht das Scrollen der Seite wieder
      document.body.style.overflow = "auto";
    }, 500); // Die Zeit muss mit der CSS-Transition übereinstimmen
    index--;
  }

}


function nextSlide(button) {
  const slider = button.closest(".slider");
  const slides = slider.querySelector(".slides");
  const indicator = slider.querySelector(".slide-indicator");
  const totalSlides = slider.querySelectorAll(".slide").length;

  let currentIndex = parseInt(slides.dataset.currentIndex || 0);

  if (currentIndex < totalSlides - 1) {
    currentIndex++;
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    slides.dataset.currentIndex = currentIndex;
  }

  indicator.textContent = `${currentIndex + 1} / ${totalSlides}`;
}

function prevSlide(button) {
  const slider = button.closest(".slider");
  const slides = slider.querySelector(".slides");
  const indicator = slider.querySelector(".slide-indicator");
  const totalSlides = slider.querySelectorAll(".slide").length;

  let currentIndex = parseInt(slides.dataset.currentIndex || 0);

  if (currentIndex > 0) {
    currentIndex--;
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    slides.dataset.currentIndex = currentIndex;
  }

  indicator.textContent = `${currentIndex + 1} / ${totalSlides}`;
}
