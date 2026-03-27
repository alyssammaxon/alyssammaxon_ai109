const startBtn = document.getElementById("start-btn");
const status = document.getElementById("status");

if (startBtn && status) {
  startBtn.addEventListener("click", () => {
    status.textContent = "Status: Thanks for visiting Alyssa Maxon's website.";
    status.style.background = "#e9f3ff";
    status.style.borderColor = "#c4d8f4";
    status.style.color = "#1e3a66";
  });
}

const simonStartBtn = document.getElementById("simon-start-btn");
const simonRestartBtn = document.getElementById("simon-restart-btn");
const simonStatus = document.getElementById("simon-status");
const roundDisplay = document.getElementById("round-display");
const roundCard = document.getElementById("round-card");
const bestScore = document.getElementById("best-score");
const pads = Array.from(document.querySelectorAll(".pad"));

if (
  simonStartBtn &&
  simonRestartBtn &&
  simonStatus &&
  roundDisplay &&
  roundCard &&
  bestScore &&
  pads.length
) {
  const colors = ["green", "red", "yellow", "blue"];
  let sequence = [];
  let playerSequence = [];
  let bestRound = 0;
  let acceptingInput = false;
  let gameActive = false;
  let interactionLocked = false;
  let roundToken = 0;

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  const setStatus = (message, tone = "default") => {
    const tones = {
      default: ["#f2fbf8", "#cde8e1", "#134e4a"],
      info: ["#e9f3ff", "#c4d8f4", "#1e3a66"],
      success: ["#ecfdf3", "#b7e3c8", "#166534"],
      error: ["#fff1f2", "#fecdd3", "#9f1239"]
    };

    const [background, borderColor, color] = tones[tone] || tones.default;
    simonStatus.textContent = `Status: ${message}`;
    simonStatus.style.background = background;
    simonStatus.style.borderColor = borderColor;
    simonStatus.style.color = color;
  };

  const updateRound = () => {
    const round = sequence.length;
    roundDisplay.textContent = String(round);
    roundCard.textContent = String(round);
    bestScore.textContent = String(bestRound);
  };

  const setPadsDisabled = (disabled) => {
    pads.forEach((pad) => {
      pad.disabled = disabled;
    });
  };

  const flashPad = async (color, duration = 420) => {
    const pad = document.querySelector(`[data-color="${color}"]`);

    if (!pad) {
      return;
    }

    pad.classList.add("active");
    await wait(duration);
    pad.classList.remove("active");
  };

  const playSequence = async (token) => {
    acceptingInput = false;
    interactionLocked = true;
    setPadsDisabled(true);
    setStatus("Watch the sequence carefully.", "info");
    await wait(400);

    for (const color of sequence) {
      if (token !== roundToken) {
        return;
      }

      await flashPad(color);
      await wait(220);
    }

    if (token !== roundToken) {
      return;
    }

    playerSequence = [];
    acceptingInput = true;
    interactionLocked = false;
    setPadsDisabled(false);
    setStatus("Your turn. Repeat the pattern.", "default");
  };

  const addStep = () => {
    const nextColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(nextColor);
    updateRound();
  };

  const resetGameState = () => {
    roundToken += 1;
    sequence = [];
    playerSequence = [];
    acceptingInput = false;
    gameActive = false;
    interactionLocked = false;
    updateRound();
    setPadsDisabled(true);
  };

  const startGame = async () => {
    resetGameState();
    gameActive = true;
    addStep();
    setStatus("Game started.", "success");
    await playSequence(roundToken);
  };

  const handlePlayerChoice = async (color) => {
    if (!acceptingInput || !gameActive || interactionLocked) {
      return;
    }

    interactionLocked = true;
    playerSequence.push(color);
    await flashPad(color, 220);

    const currentIndex = playerSequence.length - 1;

    if (playerSequence[currentIndex] !== sequence[currentIndex]) {
      bestRound = Math.max(bestRound, Math.max(sequence.length - 1, 0));
      resetGameState();
      bestScore.textContent = String(bestRound);
      setStatus("Wrong sequence. Press Start Game to try again.", "error");
      return;
    }

    if (playerSequence.length === sequence.length) {
      bestRound = Math.max(bestRound, sequence.length);
      bestScore.textContent = String(bestRound);
      acceptingInput = false;
      setPadsDisabled(true);
      setStatus("Correct. Next round coming up.", "success");
      await wait(650);
      addStep();
      interactionLocked = false;
      await playSequence(roundToken);
      return;
    }

    interactionLocked = false;
  };

  simonStartBtn.addEventListener("click", () => {
    void startGame();
  });

  simonRestartBtn.addEventListener("click", () => {
    void startGame();
  });

  pads.forEach((pad) => {
    pad.addEventListener("click", () => {
      const color = pad.dataset.color;

      if (color) {
        void handlePlayerChoice(color);
      }
    });
  });

  resetGameState();
  setStatus("Press Start Game to begin.", "default");
}
