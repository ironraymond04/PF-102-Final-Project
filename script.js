const values = [
  1, 5, 10, 25, 50, 75, 100, 200,
  300, 400, 500, 750, 1000, 2500, 5000,
  7500, 10000, 15000, 20000, 25000,
  50000, 75000, 100000, 250000, 500000, 1000000
];

let shuffledValues = [];
let keptCaseIndex = null;
let openedCases = 0;
let casesToOpen = 5;
let casesOpenedSinceOffer = 0;
let hasMadeFirstOffer = false;

const grid = document.getElementById("cases-grid");
const valueList = document.getElementById("value-list");
const message = document.getElementById("message");
const dealBtn = document.getElementById("deal-btn");
const noDealBtn = document.getElementById("no-deal-btn");

// Shuffle values randomly
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

// Setup game
function setupGame() {
  shuffledValues = shuffle(values);
  grid.innerHTML = "";
  valueList.innerHTML = "";
  openedCases = 0;
  keptCaseIndex = null;
  casesToOpen = 5;
  casesOpenedSinceOffer = 0;
  hasMadeFirstOffer = false;

  for (let i = 0; i < 26; i++) {
    const caseEl = document.createElement("div");
    caseEl.classList.add("case");
    caseEl.textContent = i + 1;
    caseEl.addEventListener("click", () => handleCaseClick(i));
    grid.appendChild(caseEl);
  }

  values.forEach(val => {
    const valEl = document.createElement("div");
    valEl.classList.add("value-item");
    valEl.textContent = `₱${val.toLocaleString()}`;
    valEl.setAttribute("data-value", val);
    valueList.appendChild(valEl);
  });

  message.textContent = "Pilion ang kahon para sa imo.";
  dealBtn.disabled = true;
  noDealBtn.disabled = true;
}

function handleCaseClick(index) {
  const cases = document.querySelectorAll(".case");

  if (keptCaseIndex === null) {
    keptCaseIndex = index;
    message.textContent = `Gikuha nimo ang kahon #${index + 1}. Ablihi ang uban.`;
    cases[index].style.backgroundColor = "#28a745";
    playSound2();
    return;
  }

  const caseEl = cases[index];
  if (index === keptCaseIndex || caseEl.classList.contains("opened")) return;

  caseEl.classList.add("opened");
  caseEl.textContent = `₱${shuffledValues[index].toLocaleString()}`;
  crossedOutValue(shuffledValues[index]);
  openedCases++;
  casesOpenedSinceOffer++;

  if (casesOpenedSinceOffer >= casesToOpen && openedCases < 25) {
    offerFromBanker();
  } else if (openedCases === 25) {
    finalReveal();
  }
}

function crossedOutValue(val) {
  const item = document.querySelector(`.value-item[data-value='${val}']`);
  if (item) item.classList.add("removed");
}

function offerFromBanker() {
  const cases = document.querySelectorAll(".case");
  const remaining = shuffledValues.filter((_, i) => {
    return !cases[i].classList.contains("opened") && i !== keptCaseIndex;
  });

  const offer = Math.round(remaining.reduce((a, b) => a + b, 0) / remaining.length);

  message.textContent = `Ang gipangayo: ₱${offer.toLocaleString()}. Padayon o Uli?`;
  dealBtn.disabled = false;
  noDealBtn.disabled = false;

  // Disable clicking on cases
  cases.forEach((caseEl, i) => {
    if (!caseEl.classList.contains("opened") && i !== keptCaseIndex) {
      caseEl.style.pointerEvents = "none";
    }
  });

  dealBtn.onclick = () => {
    message.textContent = `Gidawat nimo ang ₱${offer.toLocaleString()}! Ang kahon nimo adunay ₱${shuffledValues[keptCaseIndex].toLocaleString()}.`;
    endGame();
  };

  noDealBtn.onclick = () => {
    message.textContent = "Wala gidawat! Padayon sa pag-abli sa mga kahon.";
    dealBtn.disabled = true;
    noDealBtn.disabled = true;

    hasMadeFirstOffer = true;
    casesOpenedSinceOffer = 0;

    if (casesToOpen > 1) {
      casesToOpen--;
    }

    cases.forEach((caseEl, i) => {
      if (!caseEl.classList.contains("opened") && i !== keptCaseIndex) {
        caseEl.style.pointerEvents = "auto";
      }
    });
  };
}

function finalReveal() {
  const value = shuffledValues[keptCaseIndex];
  const finalMessage = document.getElementById("finalMessage");

  finalMessage.innerHTML = `Ang kahon nimo adunay<br>₱${value.toLocaleString()}!<br>YOU WON!!!`;
  document.getElementById("endModal").style.display = "block";
  playSound();
  endGame();
}

function closeModal() {
  document.getElementById("endModal").style.display = "none";
}

function playSound() {
    const audio = new Audio('sound.mp3');
    audio.play();
}

function playSound2() {
  const audio = new Audio('electronicpingshort.wav');
  audio.play();
}
function endGame() {
  const cases = document.querySelectorAll(".case");
  cases.forEach((caseEl, i) => {
    if (!caseEl.classList.contains("opened")) {
      caseEl.classList.add("opened");
      caseEl.textContent = `₱${shuffledValues[i].toLocaleString()}`;
    }
  });
  dealBtn.disabled = true;
  noDealBtn.disabled = true;
}

setupGame();
