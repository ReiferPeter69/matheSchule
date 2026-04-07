// ========================
// Overlay Funktionen
// ========================
function openOverlay(img) {
  const overlay = document.getElementById("overlay");
  const overlayImage = document.getElementById("overlay-image");
  overlayImage.src = img.src;
  overlay.style.display = "flex";
  overlay.style.opacity = "1";
}

function closeOverlay() {
  const overlay = document.getElementById("overlay");
  overlay.style.opacity = "0";
  setTimeout(() => {
    overlay.style.display = "none";
  }, 500);
}

// ========================
// Operatoren Overlay
// ========================
let index = 0;

function overlayRules() {
  let overlay = document.getElementById("overlayRules");
  if (index === 0) {
    overlay.style.display = "flex";
    overlay.style.opacity = "1";
    document.body.style.overflow = "hidden";
    index++;
  } else {
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.style.display = "none";
      document.body.style.overflow = "auto";
    }, 500);
    index--;
  }
}

// ========================
// Slider Funktionen
// ========================
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
    saveProgress();
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
    saveProgress();
  }
  indicator.textContent = `${currentIndex + 1} / ${totalSlides}`;
}

// ========================
// Touch-Swipe für Mobile
// ========================
let touchStartX = 0;
let touchEndX = 0;
let currentSlider = null;

document.addEventListener("touchstart", function(e) {
  const slider = e.target.closest(".slider");
  if (slider) {
    currentSlider = slider;
    touchStartX = e.changedTouches[0].screenX;
  }
}, { passive: true });

document.addEventListener("touchend", function(e) {
  if (currentSlider) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    currentSlider = null;
  }
}, { passive: true });

function handleSwipe() {
  if (!currentSlider) return;
  const diff = touchStartX - touchEndX;
  const threshold = 50;
  
  if (diff > threshold) {
    // Swipe links - nächster Slide
    const nextBtn = currentSlider.querySelector('.controls button:last-child');
    if (nextBtn) nextSlide(nextBtn);
  } else if (diff < -threshold) {
    // Swipe rechts - vorheriger Slide
    const prevBtn = currentSlider.querySelector('.controls button:first-child');
    if (prevBtn) prevSlide(prevBtn);
  }
}

// ========================
// Keyboard Navigation
// ========================
document.addEventListener("keydown", function(event) {
  // Escape für Suchfeld
  if (event.target.id === "searchInput" && event.key === "Escape") {
    document.getElementById("searchResults").style.display = "none";
    document.getElementById("searchSuggestions").style.display = "none";
    event.target.value = "";
    clearHighlights();
    return;
  }
  
  // Pfeiltasten für Slider wenn Fokus auf Slider
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    const sliders = document.querySelectorAll(".slider");
    sliders.forEach(slider => {
      const rect = slider.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        const btn = event.key === "ArrowRight" 
          ? slider.querySelector('.controls button:last-child')
          : slider.querySelector('.controls button:first-child');
        if (btn) btn.click();
      }
    });
  }
});

// ========================
// Zurück-nach-oben Button
// ========================
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", function() {
  if (window.pageYOffset > 300) {
    scrollTopBtn.classList.add("visible");
  } else {
    scrollTopBtn.classList.remove("visible");
  }
});

scrollTopBtn.addEventListener("click", function() {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ========================
// Dark/Light Mode Toggle
// ========================
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector(".theme-icon");

function setTheme(isLight) {
  document.body.classList.toggle("light-mode", isLight);
  themeIcon.textContent = isLight ? "☀️" : "🌙";
  localStorage.setItem("theme", isLight ? "light" : "dark");
}

// Gespeichertes Theme laden
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  setTheme(true);
}

themeToggle.addEventListener("click", function() {
  const isLight = document.body.classList.contains("light-mode");
  setTheme(!isLight);
});

// ========================
// Bookmarks/Lesezeichen
// ========================
let bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");

function addBookmark(sliderNumber) {
  const existingIndex = bookmarks.indexOf(sliderNumber);
  if (existingIndex === -1) {
    bookmarks.push(sliderNumber);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    showNotification("Lesezeichen für Funktion " + sliderNumber + " gesetzt!");
  } else {
    bookmarks.splice(existingIndex, 1);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    showNotification("Lesezeichen für Funktion " + sliderNumber + " entfernt!");
  }
  updateBookmarkButtonStates();
}

function removeBookmark(sliderNumber) {
  bookmarks = bookmarks.filter(b => b !== sliderNumber);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  renderBookmarks();
  updateBookmarkButtonStates();
}

function openBookmarks() {
  renderBookmarks();
  document.getElementById("bookmarksOverlay").style.display = "flex";
  document.getElementById("bookmarksOverlay").style.opacity = "1";
}

function closeBookmarks(event) {
  if (event && event.target !== event.currentTarget) return;
  const overlay = document.getElementById("bookmarksOverlay");
  overlay.style.opacity = "0";
  setTimeout(() => { overlay.style.display = "none"; }, 300);
}

function renderBookmarks() {
  const container = document.getElementById("bookmarksList");
  if (bookmarks.length === 0) {
    container.innerHTML = '<p class="no-bookmarks">Noch keine Lesezeichen gesetzt.</p>';
    return;
  }
  
  const sliderNames = {
    1: "Anzeige des Graphen",
    2: "Der Regler",
    3: "Nullstelle anzeigen",
    4: "Schnittpunkte finden",
    5: "Gleichungen lösen",
    6: "Polynom vereinfachen",
    7: "Funktion faktorisieren",
    8: "Ableitung",
    9: "Tangente",
    10: "Trigonometrie",
    11: "Wendepunkt",
    12: "Extremum",
    13: "Min und Max",
    14: "Summenzeichen",
    15: "Abs-Funktion",
    16: "IntegralZwischen"
  };
  
  let html = "";
  bookmarks.forEach(num => {
    html += `
      <div class="bookmark-item" onclick="goToSlider(${num})">
        <span>📌 Funktion ${num}: ${sliderNames[num] || "Unbekannt"}</span>
        <button class="remove-bookmark-btn" onclick="event.stopPropagation(); removeBookmark(${num})">✕</button>
      </div>
    `;
  });
  container.innerHTML = html;
}

function goToSlider(sliderNumber) {
  closeBookmarks();
  const slider = document.getElementById("slider" + sliderNumber);
  if (slider) {
    slider.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function updateBookmarkButtonStates() {
  document.querySelectorAll(".bookmark-slider-btn").forEach(btn => {
    const onclick = btn.getAttribute("onclick");
    if (onclick) {
      const match = onclick.match(/addBookmark\((\d+)\)/);
      if (match) {
        const num = parseInt(match[1]);
        const isBookmarked = bookmarks.includes(num);
        btn.style.opacity = isBookmarked ? "1" : "0.5";
        btn.textContent = isBookmarked ? "🔖" : "🔖";
      }
    }
  });
}

document.getElementById("bookmarkBtn").addEventListener("click", openBookmarks);

// ========================
// Fortschritt speichern
// ========================
function saveProgress() {
  const progress = {};
  document.querySelectorAll(".slider").forEach((slider, index) => {
    const slides = slider.querySelector(".slides");
    const currentIndex = parseInt(slides.dataset.currentIndex || 0);
    progress[index] = currentIndex;
  });
  localStorage.setItem("sliderProgress", JSON.stringify(progress));
}

function loadProgress() {
  const saved = JSON.parse(localStorage.getItem("sliderProgress") || "{}");
  document.querySelectorAll(".slider").forEach((slider, index) => {
    if (saved[index] !== undefined) {
      const slides = slider.querySelector(".slides");
      const totalSlides = slider.querySelectorAll(".slide").length;
      const targetIndex = Math.min(saved[index], totalSlides - 1);
      if (targetIndex > 0) {
        slides.style.transform = `translateX(-${targetIndex * 100}%)`;
        slides.dataset.currentIndex = targetIndex;
        const indicator = slider.querySelector(".slide-indicator");
        if (indicator) {
          indicator.textContent = `${targetIndex + 1} / ${totalSlides}`;
        }
      }
    }
  });
}

// Fortschritt beim Laden wiederherstellen
document.addEventListener("DOMContentLoaded", function() {
  loadProgress();
  updateBookmarkButtonStates();
  initTOC();
});

// ========================
// Druckfunktion
// ========================
document.getElementById("printBtn").addEventListener("click", function() {
  window.print();
});

// ========================
// Inhaltsverzeichnis
// ========================
function initTOC() {
  const tocList = document.getElementById("tocList");
  const sliders = document.querySelectorAll(".slider");
  
  const sliderNames = {
    1: "Anzeige des Graphen",
    2: "Der Regler",
    3: "Nullstelle anzeigen",
    4: "Schnittpunkte finden",
    5: "Gleichungen lösen",
    6: "Polynom vereinfachen",
    7: "Funktion faktorisieren",
    8: "Ableitung",
    9: "Tangente",
    10: "Trigonometrie",
    11: "Wendepunkt",
    12: "Extremum",
    13: "Min und Max",
    14: "Summenzeichen",
    15: "Abs-Funktion",
    16: "IntegralZwischen"
  };
  
  let html = "";
  sliders.forEach((slider, index) => {
    const num = index + 1;
    html += `<div class="toc-item" onclick="goToSliderFromTOC(${num})">
      <span class="toc-number">${num}</span>
      <span class="toc-title">Funktion ${num}: ${sliderNames[num]}</span>
      <span class="toc-arrow">&#8594;</span>
    </div>`;
  });
  tocList.innerHTML = html;
}

function openTOC() {
  document.getElementById("tocOverlay").style.display = "flex";
  document.getElementById("tocOverlay").style.opacity = "1";
}

function closeTOC(event) {
  if (event && event.target !== event.currentTarget) return;
  const overlay = document.getElementById("tocOverlay");
  overlay.style.opacity = "0";
  setTimeout(() => { overlay.style.display = "none"; }, 300);
}

function goToSliderFromTOC(sliderNumber) {
  const slider = document.getElementById("slider" + sliderNumber);
  if (slider) {
    // Zuerst Overlay schließen
    const overlay = document.getElementById("tocOverlay");
    overlay.style.opacity = "0";
    setTimeout(() => { overlay.style.display = "none"; }, 300);
    // Dann zum Slider scrollen
    setTimeout(() => {
      slider.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
}

document.getElementById("tocBtn").addEventListener("click", openTOC);

// ========================
// Quiz/Test Funktion
// ========================
const quizQuestions = [
  {
    question: "Wie aktivierst du eine Funktion im Graphen?",
    answers: [
      "Durch Klicken auf den grünen Kreis neben der Funktion",
      "Durch Doppelklick auf den Graphen",
      "Durch Drücken der Enter-Taste",
      "Durch Rechtsklick auf die Funktion"
    ],
    correct: 0
  },
  {
    question: "Welchen Befehl verwendest du, um Nullstellen zu berechnen?",
    answers: [
      "löschen(f)",
      "Nullstelle(f)",
      "schnittpunkt(f)",
      "wurzel(f)"
    ],
    correct: 1
  },
  {
    question: "Wie findest du den Schnittpunkt zweier Funktionen f und g?",
    answers: [
      "kreuzung(f, g)",
      "treffen(f, g)",
      "Schnittpunkt(f, g)",
      "punkt(f, g)"
    ],
    correct: 2
  },
  {
    question: "Was macht die Funktion Polynom()?",
    answers: [
      "Sie löscht das Polynom",
      "Sie zeichnet das Polynom",
      "Sie vereinfacht den Term in Polynomialform",
      "Sie berechnet die Nullstellen"
    ],
    correct: 2
  },
  {
    question: "Wie leitest du eine Funktion f ab?",
    answers: [
      "differenzieren(f)",
      "Ableitung(f) oder f'",
      "steigung(f)",
      "tach f"
    ],
    correct: 1
  },
  {
    question: "Welche Regel besagt: (f·g)' = f'·g + f·g'?",
    answers: [
      "Summenregel",
      "Faktorregel",
      "Produktregel",
      "Kettenregel"
    ],
    correct: 2
  },
  {
    question: "Was berechnet Tangente(f, A)?",
    answers: [
      "Den Flächeninhalt unter f",
      "Die Tangente an f im Punkt A",
      "Die Nullstelle von f",
      "Den Schnittpunkt von f"
    ],
    correct: 1
  },
  {
    question: "Wie berechnest du den Winkel in Grad mit arcsin?",
    answers: [
      "arcsin(x)",
      "arcsin(x, degree)",
      "arcsin(x)d",
      "arcsin(x)g"
    ],
    correct: 2
  },
  {
    question: "Was ist ein Wendepunkt?",
    answers: [
      "Ein Punkt, wo die Funktion maximal ist",
      "Ein Punkt, wo die Funktion die x-Achse schneidet",
      "Ein Punkt, wo sich die Krümmung ändert",
      "Ein Punkt, wo die Funktion minimal ist"
    ],
    correct: 2
  },
  {
    question: "Was berechnet Extremum(f)?",
    answers: [
      "Alle Punkte auf f",
      "Nur Hochpunkte",
      "Nur Tiefpunkte",
      "Hoch- und Tiefpunkte von f"
    ],
    correct: 3
  },
  {
    question: "Wie berechnest du die Summe von i=1 bis 10?",
    answers: [
      "sum(i, 1, 10)",
      "Summe(i, i, 1, 10)",
      "addiere(i, 1, 10)",
      "gesamt(i, 1, 10)"
    ],
    correct: 1
  },
  {
    question: "Warum verwendet man abs() beim Integral?",
    answers: [
      "Um die Funktion zu vereinfachen",
      "Damit alle Flächen positiv gezählt werden",
      "Um die Ableitung zu berechnen",
      "Um den Graphen zu verschieben"
    ],
    correct: 1
  },
  {
    question: "Was berechnet IntegralZwischen(f, g, a, b)?",
    answers: [
      "Integral von f von a bis b",
      "Integral von g von a bis b",
      "Fläche zwischen f und g von a bis b",
      "Schnittpunkte von f und g"
    ],
    correct: 2
  },
  {
    question: "Was passiert wenn du beim Regler auf Play drückst?",
    answers: [
      "Der Regler wird gelöscht",
      "Der Regler wird animiert",
      "Der Regler wird fixiert",
      "Nichts passiert"
    ],
    correct: 1
  },
  {
    question: "Was macht faktorisiere(f)?",
    answers: [
      "Es leitet f ab",
      "Es integriert f",
      "Es zerlegt f in Linearfaktoren",
      "Es zeichnet f"
    ],
    correct: 2
  }
];

let currentQuestion = 0;
let score = 0;
let shuffledQuestions = [];
let answered = false;

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function startQuiz() {
  shuffledQuestions = shuffleArray(quizQuestions);
  currentQuestion = 0;
  score = 0;
  document.getElementById("quizStart").style.display = "none";
  document.getElementById("quizEnd").style.display = "none";
  document.getElementById("quizQuestion").style.display = "block";
  document.getElementById("quizScore").textContent = shuffledQuestions.length;
  showQuestion();
}

function showQuestion() {
  if (currentQuestion >= shuffledQuestions.length) {
    showQuizEnd();
    return;
  }
  
  answered = false;
  const q = shuffledQuestions[currentQuestion];
  document.getElementById("questionText").textContent = `Frage ${currentQuestion + 1}/${shuffledQuestions.length}: ${q.question}`;
  document.getElementById("quizFeedback").style.display = "none";
  document.getElementById("nextQuestionBtn").style.display = "none";
  
  const container = document.getElementById("answersContainer");
  container.innerHTML = "";
  
  q.answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.className = "quiz-answer-btn";
    btn.textContent = answer;
    btn.onclick = () => checkAnswer(index);
    container.appendChild(btn);
  });
}

function checkAnswer(selectedIndex) {
  if (answered) return;
  answered = true;
  
  const q = shuffledQuestions[currentQuestion];
  const buttons = document.querySelectorAll(".quiz-answer-btn");
  const feedback = document.getElementById("quizFeedback");
  
  buttons.forEach((btn, index) => {
    btn.disabled = true;
    if (index === q.correct) {
      btn.classList.add("correct");
    } else if (index === selectedIndex) {
      btn.classList.add("wrong");
    }
  });
  
  if (selectedIndex === q.correct) {
    score++;
    feedback.textContent = "✅ Richtig! Gut gemacht!";
    feedback.className = "quiz-feedback correct";
  } else {
    feedback.textContent = `❌ Falsch! Die richtige Antwort wäre: ${q.answers[q.correct]}`;
    feedback.className = "quiz-feedback wrong";
  }
  feedback.style.display = "block";
  document.getElementById("nextQuestionBtn").style.display = "inline-block";
}

function nextQuestion() {
  currentQuestion++;
  showQuestion();
}

function showQuizEnd() {
  document.getElementById("quizQuestion").style.display = "none";
  document.getElementById("quizEnd").style.display = "block";
  
  const percentage = Math.round((score / shuffledQuestions.length) * 100);
  let message = "";
  if (percentage >= 90) message = "🏆 Ausgezeichnet!";
  else if (percentage >= 70) message = "👍 Gut gemacht!";
  else if (percentage >= 50) message = "📚 Weiter üben!";
  else message = "💪 Nicht aufgeben!";
  
  document.getElementById("finalScore").textContent = 
    `Du hast ${score} von ${shuffledQuestions.length} Fragen richtig beantwortet (${percentage}%). ${message}`;
}

function restartQuiz() {
  document.getElementById("quizEnd").style.display = "none";
  document.getElementById("quizStart").style.display = "block";
}

function openQuiz() {
  document.getElementById("quizOverlay").style.display = "flex";
  document.getElementById("quizOverlay").style.opacity = "1";
}

function closeQuiz(event) {
  if (event && event.target !== event.currentTarget) return;
  const overlay = document.getElementById("quizOverlay");
  overlay.style.opacity = "0";
  setTimeout(() => { overlay.style.display = "none"; }, 300);
}

document.getElementById("quizBtn").addEventListener("click", openQuiz);

// ========================
// Suchfunktionalität
// ========================
let searchTimeout;

function searchFunctions() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  const resultsContainer = document.getElementById("searchResults");
  
  clearTimeout(searchTimeout);
  
  if (query === "") {
    resultsContainer.style.display = "none";
    document.getElementById("searchSuggestions").style.display = "none";
    clearHighlights();
    return;
  }
  
  // Autocomplete Vorschläge anzeigen
  showSuggestions(query);
  
  searchTimeout = setTimeout(() => {
    const sliders = document.querySelectorAll(".slider");
    const results = [];
    
    sliders.forEach((slider, sliderIndex) => {
      const slides = slider.querySelectorAll(".slide");
      
      slides.forEach((slide, slideIndex) => {
        const title = slide.querySelector("h2");
        const titleText = title ? title.textContent.toLowerCase() : "";
        
        const paragraphs = slide.querySelectorAll("p");
        let matchingParagraph = null;
        
        paragraphs.forEach(p => {
          const text = p.textContent.toLowerCase();
          if (text.includes(query) && !matchingParagraph) {
            matchingParagraph = p.textContent;
          }
        });
        
        if (titleText.includes(query) || matchingParagraph) {
          const sliderNumber = sliderIndex + 1;
          const titleFull = title ? title.textContent : "Unbekannt";
          const preview = matchingParagraph 
            ? matchingParagraph.substring(0, 100) + (matchingParagraph.length > 100 ? "..." : "")
            : "";
          
          results.push({
            slider: slider,
            sliderIndex: sliderIndex,
            slideIndex: slideIndex,
            sliderNumber: sliderNumber,
            title: titleFull,
            preview: preview
          });
        }
      });
    });
    
    if (results.length === 0) {
      resultsContainer.innerHTML = `<div class="search-no-results">Keine Ergebnisse für "${escapeHtml(query)}"</div>`;
    } else {
      let html = "";
      results.forEach(result => {
        html += `
          <div class="search-result-item" onclick="navigateToResult(${result.sliderIndex}, ${result.slideIndex})">
            <div class="result-title">${result.title}</div>
            ${result.preview ? `<div class="result-preview">${escapeHtml(result.preview)}</div>` : ""}
          </div>
        `;
      });
      resultsContainer.innerHTML = html;
    }
    
    resultsContainer.style.display = "block";
    clearHighlights();
    highlightText(query);
  }, 200);
}

// Autocomplete Vorschläge
function showSuggestions(query) {
  const suggestionsContainer = document.getElementById("searchSuggestions");
  const allSuggestions = [
    "Anzeige des Graphen",
    "Graphenansicht anpassen",
    "Regler",
    "Schieberegler",
    "Nullstelle",
    "Schnittpunkt",
    "Lösen",
    "Gleichungen",
    "Polynom",
    "vereinfachen",
    "faktorisieren",
    "Ableitung",
    "Potenzregel",
    "Produktregel",
    "Tangente",
    "Trigonometrie",
    "sin",
    "cos",
    "tan",
    "Wendepunkt",
    "Extremum",
    "Hochpunkt",
    "Tiefpunkt",
    "Minimum",
    "Maximum",
    "Summe",
    "Integral",
    "Fläche",
    "abs",
    "Betrag",
    "IntegralZwischen"
  ];
  
  const filtered = allSuggestions.filter(s => 
    s.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);
  
  if (filtered.length === 0) {
    suggestionsContainer.style.display = "none";
    return;
  }
  
  let html = "";
  filtered.forEach(suggestion => {
    html += `<div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">${highlightMatch(suggestion, query)}</div>`;
  });
  
  suggestionsContainer.innerHTML = html;
  suggestionsContainer.style.display = "block";
}

function highlightMatch(text, query) {
  const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
  return text.replace(regex, '<mark>$1</mark>');
}

function selectSuggestion(suggestion) {
  document.getElementById("searchInput").value = suggestion;
  document.getElementById("searchSuggestions").style.display = "none";
  searchFunctions();
}

function navigateToResult(sliderIndex, slideIndex) {
  const sliders = document.querySelectorAll(".slider");
  const targetSlider = sliders[sliderIndex];
  
  if (!targetSlider) return;
  
  targetSlider.scrollIntoView({ behavior: "smooth", block: "start" });
  
  const slides = targetSlider.querySelector(".slides");
  const totalSlides = targetSlider.querySelectorAll(".slide").length;
  
  if (slideIndex > 0 && slideIndex < totalSlides) {
    slides.style.transform = `translateX(-${slideIndex * 100}%)`;
    slides.dataset.currentIndex = slideIndex;
    
    const indicator = targetSlider.querySelector(".slide-indicator");
    if (indicator) {
      indicator.textContent = `${slideIndex + 1} / ${totalSlides}`;
    }
  }
  
  document.getElementById("searchResults").style.display = "none";
  document.getElementById("searchSuggestions").style.display = "none";
  document.getElementById("searchInput").value = "";
  clearHighlights();
}

function highlightText(query) {
  if (!query) return;
  
  const sliders = document.querySelectorAll(".slider");
  const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
  
  sliders.forEach(slider => {
    const paragraphs = slider.querySelectorAll("p");
    const titles = slider.querySelectorAll("h2");
    
    [...titles, ...paragraphs].forEach(el => {
      const text = el.textContent;
      if (text.toLowerCase().includes(query.toLowerCase()) && !el.querySelector("mark.search-highlight")) {
        el.innerHTML = text.replace(regex, '<mark class="search-highlight">$1</mark>');
      }
    });
  });
}

function clearHighlights() {
  const highlights = document.querySelectorAll("mark.search-highlight");
  highlights.forEach(mark => {
    const parent = mark.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    }
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Klick außerhalb schließt Suchergebnisse
document.addEventListener("click", function(event) {
  const searchContainer = document.querySelector(".search-container");
  const resultsContainer = document.getElementById("searchResults");
  const suggestionsContainer = document.getElementById("searchSuggestions");
  
  if (searchContainer && !searchContainer.contains(event.target)) {
    resultsContainer.style.display = "none";
    suggestionsContainer.style.display = "none";
  }
});

// ========================
// Benachrichtigungen
// ========================
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 2000);
}