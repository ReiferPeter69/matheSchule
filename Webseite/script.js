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
  