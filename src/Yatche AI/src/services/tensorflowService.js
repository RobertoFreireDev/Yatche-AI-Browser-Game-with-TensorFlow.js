import * as tf from '@tensorflow/tfjs'

class TensorflowService {
  static instance = null

  static getInstance() {
    if (!TensorflowService.instance) {
      TensorflowService.instance = new TensorflowService()
    }

    return TensorflowService.instance
  }

  async runSimpleDemo() {
    const model = tf.sequential()
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }))

    model.compile({
      loss: 'meanSquaredError',
      optimizer: 'sgd',
    })

    const xs = tf.tensor2d([1, 2, 3, 4], [4, 1])
    const ys = tf.tensor2d([1, 3, 5, 7], [4, 1])

    await model.fit(xs, ys, { epochs: 100 })

    const predictionInput = tf.tensor2d([5], [1, 1])
    const predictionTensor = model.predict(predictionInput)
    predictionTensor.print()

    const prediction = predictionTensor.dataSync()[0]

    xs.dispose()
    ys.dispose()
    predictionInput.dispose()
    predictionTensor.dispose()
    model.dispose()

    return prediction
  }
}

const tensorflowService = TensorflowService.getInstance()

export default tensorflowService
