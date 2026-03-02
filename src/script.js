const diceContainer = document.getElementById("dice-container");
const scoreboard = document.getElementById("scoreboard");

let dice = [];
let held = [];
let rollsLeft = 3;
let totalScore = 0;

const categories = {
  ones: null,
  twos: null,
  threes: null,
  fours: null,
  fives: null,
  sixes: null,
  threeKind: null,
  fourKind: null,
  fullHouse: null,
  smallStraight: null,
  largeStraight: null,
  yatche: null,
  chance: null
};

function initDice() {
  diceContainer.innerHTML = "";
  dice = [];
  held = [];

  for (let i = 0; i < 5; i++) {
    dice.push(1);
    held.push(false);

    const diceDiv = document.createElement("div");
    diceDiv.classList.add("dice");
    diceDiv.textContent = "?";

    diceDiv.addEventListener("click", () => {
      if (rollsLeft < 3) {
        held[i] = !held[i];
        diceDiv.classList.toggle("held");
      }
    });

    diceContainer.appendChild(diceDiv);
  }

  const rollDiceDiv = document.createElement("div");
  rollDiceDiv.classList.add("roll-btn");
  rollDiceDiv.textContent = "🎲";
  diceContainer.appendChild(rollDiceDiv);

  rollDiceDiv.addEventListener("click", () => {
    if (!rollDice())
    {
        return;
    }

    rollDiceDiv.classList.add("spin");
    setTimeout(() => {
        rollDiceDiv.classList.remove("spin");
    }, 400);
    });
}

function rollDice() {
  if (rollsLeft === 0) return false;

  const diceElements = document.querySelectorAll(".dice");

  for (let i = 0; i < 5; i++) {
    if (!held[i]) {
      dice[i] = Math.floor(Math.random() * 6) + 1;
      diceElements[i].textContent = dice[i];
    }
  }

  rollsLeft--;

  return true;
}

function calculateUpper(value) {
  return dice.filter(d => d === value).reduce((a, b) => a + b, 0);
}

function countDice() {
  const counts = {};
  dice.forEach(d => counts[d] = (counts[d] || 0) + 1);
  return counts;
}

function scoreCategory(category) {
  if (categories[category] !== null) return;

  let score = 0;
  const counts = countDice();
  const values = Object.values(counts);
  const sum = dice.reduce((a, b) => a + b, 0);
  const unique = [...new Set(dice)].sort();

  switch (category) {
    case "ones": score = calculateUpper(1); break;
    case "twos": score = calculateUpper(2); break;
    case "threes": score = calculateUpper(3); break;
    case "fours": score = calculateUpper(4); break;
    case "fives": score = calculateUpper(5); break;
    case "sixes": score = calculateUpper(6); break;
    case "threeKind": score = values.includes(3) ? sum : 0; break;
    case "fourKind": score = values.includes(4) ? sum : 0; break;
    case "fullHouse": score = (values.includes(3) && values.includes(2)) ? 25 : 0; break;
    case "smallStraight": score = hasStraight(unique, 4) ? 30 : 0; break;
    case "largeStraight": score = hasStraight(unique, 5) ? 40 : 0; break;
    case "yatche": score = values.includes(5) ? 50 : 0; break;
    case "chance": score = sum; break;
  }

  categories[category] = score;
  totalScore += score;

  resetTurn();
  renderTable();
  checkGameEnd();
}

function hasStraight(arr, length) {
  let count = 1;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] === arr[i - 1] + 1) {
      count++;
      if (count >= length) return true;
    } else {
      count = 1;
    }
  }
  return false;
}

function resetTurn() {
  rollsLeft = 3;
  held = [false, false, false, false, false];
  document.querySelectorAll(".dice").forEach(d => d.classList.remove("held"));
}

function renderTable() {
  scoreboard.innerHTML = `
    <table>
      <tr><th>Category</th><th>Score</th></tr>
      ${createRow("Ones", "ones")}
      ${createRow("Twos", "twos")}
      ${createRow("Threes", "threes")}
      ${createRow("Fours", "fours")}
      ${createRow("Fives", "fives")}
      ${createRow("Sixes", "sixes")}
      ${createRow("Three of a Kind", "threeKind")}
      ${createRow("Four of a Kind", "fourKind")}
      ${createRow("Full House", "fullHouse")}
      ${createRow("Small Straight", "smallStraight")}
      ${createRow("Large Straight", "largeStraight")}
      ${createRow("Yatche", "yatche")}
      ${createRow("Chance", "chance")}
      <tr><th>Total</th><th>${totalScore}</th></tr>
    </table>
  `;
}

function createRow(label, key) {
  const value = categories[key];
  const usedClass = value !== null ? "used" : "category";
  const display = value !== null ? value : "-";

  return `
    <tr class="${usedClass}" onclick="scoreCategory('${key}')">
      <td>${label}</td>
      <td>${display}</td>
    </tr>
  `;
}

function checkGameEnd() {
  const finished = Object.values(categories).every(v => v !== null);
  if (finished) {
    alert("🎉 Game Over! Final Score: " + totalScore);
  }
}

initDice();
renderTable();