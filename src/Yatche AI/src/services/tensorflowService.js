import * as tf from '@tensorflow/tfjs'

const MODEL_STORAGE_KEY = 'yatche-ai-model'

class TensorflowService {
  static instance = null
  pendingSamples = []
  model = null
  initializationPromise = null

  static getInstance() {
    if (!TensorflowService.instance) {
      TensorflowService.instance = new TensorflowService()
    }

    return TensorflowService.instance
  }

  addPendingSample(sample) {
    this.pendingSamples.push(sample)
  }

  createModel() {
    const model = tf.sequential()

    // Input layer
    // 5 dice values (1,2,3,4,5,6)
    // 5 hold dices (0,1)
    // 1 rolls left (0,1,2,3)
    // 13 chosen categories (0,1)
    // Total = 24 inputs
    model.add(tf.layers.dense({ inputShape: [24], units: 64, activation: 'relu' }))

    // Output layer
    // 5 hold dices (0,1)
    // 1 rolls left (0,1,2,3)
    // 13 chosen categories (0,1)
    // Total = 19 outputs
    model.add(tf.layers.dense({ units: 19, activation: 'softmax' }))

    // Review this loss function, maybe we should use a custom one to better fit our problem
    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    })

    return model
  }

  async initialize() {
    if (this.model) return true
    if (this.initializationPromise) return this.initializationPromise

    this.initializationPromise = this.loadModelFromStorage()
      .finally(() => {
        this.initializationPromise = null
      })

    return this.initializationPromise
  }

  async loadModelFromStorage() {
    try {
      this.model = await tf.loadLayersModel(`localstorage://${MODEL_STORAGE_KEY}`)
      return true
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes('cannot find model')) {
        return false
      }
      throw error
    }
  }

  async saveModelToStorage() {
    if (!this.model) {
      throw new Error('Model is not trained yet. Call trainModel() before saving.')
    }

    await this.model.save(`localstorage://${MODEL_STORAGE_KEY}`)
  }

  async trainModel() {
    if (this.pendingSamples.length === 0) {
      throw new Error('No training samples available yet. Play and score first to collect samples.')
    }

    this.model = this.createModel()

    await this.model.fit(
      tf.tensor2d(this.pendingSamples.map((sample) => sample.input)),
      tf.tensor2d(this.pendingSamples.map((sample) => sample.output)),
      {
        verbose: 0,
        epochs: 10,
        shuffle: true,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}, accuracy = ${logs.accuracy}`)
          },
        },
      }
    )
  }

  async predict(input) {
    if (!this.model) {
      const loaded = await this.initialize()
      if (!loaded) {
        throw new Error('Model is not trained yet. Train and save the model first.')
      }
    }

    if (!Array.isArray(input) || input.length !== 24) {
      throw new Error('predict() expects an input array with 24 values.')
    }

    const inputTensor = tf.tensor2d([input])
    const predictionTensor = this.model.predict(inputTensor)
    const output = Array.from(await predictionTensor.data())

    inputTensor.dispose()
    predictionTensor.dispose()

    const holdScores = output.slice(0, 5)
    const rollsLeftScore = output[5]
    const categoryScores = output.slice(6, 19)

    const suggestedHold = holdScores.map((score) => (score >= 0.5 ? 1 : 0))
    const suggestedRollsLeft = Math.max(0, Math.min(3, Math.round(rollsLeftScore * 3)))
    const suggestedCategoryIndex = categoryScores.indexOf(Math.max(...categoryScores))

    return {
      holdDice: suggestedHold,
      rollsLeft: suggestedRollsLeft,
      categoryIndex: suggestedCategoryIndex,
      scores: {
        holdDice: holdScores,
        rollsLeft: rollsLeftScore,
        categories: categoryScores,
      },
      rawOutput: output,
    }
  }
}

const tensorflowService = TensorflowService.getInstance()

export default tensorflowService
