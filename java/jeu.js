// Vérifie si le navigateur supporte la reconnaissance vocale
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
  alert("Votre navigateur ne supporte pas la reconnaissance vocale !");
}

const recognition = new SpeechRecognition();
recognition.lang = 'fr-FR';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const startBtn = document.getElementById('start');
const recognizedText = document.getElementById('recognized');
const correctedText = document.getElementById('corrected');
const genderText = document.getElementById('gender');

// Fonction simple de correction automatique
function correctPhrase(phrase) {
  phrase = phrase.replace(/\bjaime\b/gi, "j'aime");
  phrase = phrase.replace(/\bmoi suis\b/gi, "je suis");
  phrase = phrase.replace(/\btu es aller\b/gi, "tu es allé(e)");
  phrase = phrase.replace(/\bsa\b/gi, "ça");
  return phrase;
}

// Détection de genre simulée (fille/garçon)
function detectGender() {
  return Math.random() > 0.5 ? "Fille" : "Garçon";
}

// Fonction lecture vocale avec voix adaptée
function speakText(text, gender) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';

  let voices = window.speechSynthesis.getVoices();

  function assignVoice() {
    if (voices.length === 0) return;
    if (gender === "Fille") {
      utterance.voice = voices.find(v => v.lang.includes('FR') && /female/i.test(v.name)) || voices[0];
    } else {
      utterance.voice = voices.find(v => v.lang.includes('FR') && /male/i.test(v.name)) || voices[0];
    }
    window.speechSynthesis.speak(utterance);
  }

  if (voices.length === 0) {
    // Attend que les voix soient chargées
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      voices = window.speechSynthesis.getVoices();
      assignVoice();
    });
  } else {
    assignVoice();
  }
}

// Début reconnaissance vocale
startBtn.addEventListener('click', () => {
  try {
    recognition.start();
  } catch (e) {
    console.error("Erreur démarrage reconnaissance vocale :", e);
  }
});

// Quand la reconnaissance retourne un résultat
recognition.addEventListener('result', (event) => {
  let text = event.results[0][0].transcript;
  recognizedText.textContent = text;

  let corrected = correctPhrase(text);
  correctedText.textContent = corrected;

  let gender = detectGender();
  genderText.textContent = gender;

  // Lecture vocale du texte corrigé
  speakText(corrected, gender);
});

// Gestion des erreurs
recognition.addEventListener('error', (e) => {
  console.error("Erreur reconnaissance vocale :", e.error);
});
