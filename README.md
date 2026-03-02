# 🎲 Yatche AI – Browser-Based Game with TensorFlow.js

A simple **Yatche (Yahtzee-style) dice game** built using only:

- HTML  
- CSS  
- Vanilla JavaScript  
- TensorFlow.js (running entirely inside the browser)

This project combines game development and machine learning by allowing players to generate training data that is used to train an AI model directly in the browser.

---

## 🚀 Project Goals

1. Create a fully playable Yatche-style dice game using only frontend technologies.
2. Allow players to play normally while capturing gameplay data.
3. Train a machine learning model using TensorFlow.js in the browser.
4. On every turn, allow the AI model to decide:
   - Roll the dice (if rolls remain)
   - Score the current dice combination

---

## 🧠 AI Concept

During gameplay, the system captures:

- Current dice values (5 dice)
- Rolls remaining (0–2)
- Available score categories
- Player decision (roll or score)
- Selected scoring category

This data is used to train a neural network model directly in the browser.

The trained model receives the current game state and predicts:

- Whether to roll or score
- (Optionally) Which scoring category to choose
