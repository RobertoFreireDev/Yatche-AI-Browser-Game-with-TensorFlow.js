import * as tf from '@tensorflow/tfjs'

class TensorflowService {
  static instance = null
  pendingSamples = []

  static getInstance() {
    if (!TensorflowService.instance) {
      TensorflowService.instance = new TensorflowService()
    }

    return TensorflowService.instance
  }

  async trainModel() {
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

    await model.fit(
      tf.tensor2d(this.pendingSamples.map(sample => sample.input)),
      tf.tensor2d(this.pendingSamples.map(sample => sample.output)),
      {
        verbose: 0,
        epochs: 10,
        shuffle: true,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}, accuracy = ${logs.acc}`)
          },
        },
      }
    )

    return model
  }
}

const tensorflowService = TensorflowService.getInstance()

export default tensorflowService
