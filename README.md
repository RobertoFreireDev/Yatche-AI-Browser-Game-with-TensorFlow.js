🎲 Yatche AI – Browser Game with TensorFlow.js

A simple Yatche (Yahtzee-like) game built using only:

✅ HTML

✅ CSS

✅ Vanilla JavaScript

✅ TensorFlow.js (running directly in the browser)

The goal of this project is not only to build a playable dice game, but also to collect gameplay data and train an AI model directly inside the browser.

🚀 Project Goals

Create a fully functional Yatche-style dice game

Allow human players to play normally

Capture gameplay decisions as training data

Train a model using TensorFlow.js

Let the AI decide actions every turn:

🎲 Roll the dice (if rolls remain)

📝 Score the current dice combination

🧠 AI Concept

During gameplay, we collect:

Current dice values

Rolls remaining

Available score categories

Player decision (roll or score)

Selected scoring category

This dataset is used to train a neural network inside the browser using:

👉 @tensorflow/tfjs

The trained model will:

Receive the current game state as input

Predict the best action:

Roll again

Score

Select scoring category

🏗 Architecture
/index.html
/style.css
/game.js
/ai.js
/model.js
🔹 index.html

Game structure and TensorFlow.js script loading.

🔹 style.css

Simple responsive styling.

🔹 game.js

Handles:

Dice rolling

Turn logic

Score calculation

Data capture

🔹 ai.js

Prepares training dataset

Encodes game state

Calls model predictions

🔹 model.js

Defines neural network

Trains model

Saves model to browser storage

Loads model from local storage

🧩 Game Rules (Simplified)

5 dice

Up to 3 rolls per turn

Player chooses scoring category

Standard Yatche combinations:

Ones to Sixes

Three of a kind

Four of a kind

Full House

Small Straight

Large Straight

Yatche

Chance

📊 Training Strategy
Inputs:

Dice values (5 numbers)

Rolls remaining

Available score categories (binary flags)

Output:

Action:

0 = Roll

1 = Score

(Optional) Score category selection

🤖 Example Model (TensorFlow.js)
const model = tf.sequential();

model.add(tf.layers.dense({ inputShape: [inputSize], units: 64, activation: 'relu' }));
model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
model.add(tf.layers.dense({ units: outputSize, activation: 'softmax' }));

model.compile({
  optimizer: 'adam',
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy']
});
🌍 Why Run in the Browser?

Using TensorFlow.js allows:

No backend required

Training directly on player behavior

Model stored locally

Real-time AI improvement

Fully client-side ML

💾 Model Persistence

We use browser storage:

await model.save('localstorage://yatche-model');

To reload:

const model = await tf.loadLayersModel('localstorage://yatche-model');
🧪 Future Improvements

Reinforcement learning instead of supervised learning

Multiplayer data aggregation

Model visualization

Difficulty levels

Export trained model

▶️ How to Run

Clone the repository

git clone https://github.com/your-username/yatche-ai.git

Open index.html in your browser

Start playing 🎲

Train the AI

Let the AI play!

📚 Technologies Used

HTML5

CSS3

Vanilla JavaScript

TensorFlow.js

🧠 Learning Objectives

This project is perfect for learning:

Game state modeling

Feature engineering

Neural networks in the browser

Supervised learning

AI decision systems

Client-side ML engineering
