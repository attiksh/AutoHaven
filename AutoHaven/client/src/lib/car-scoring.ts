import * as tf from '@tensorflow/tfjs';
import { Car } from '@shared/schema';

let model: tf.LayersModel | null = null;
const modelIndexMap = new Map<string, number>();

function modelToFactor(model: string): number {
  if (!modelIndexMap.has(model)) {
    modelIndexMap.set(model, modelIndexMap.size);
  }
  return modelIndexMap.get(model)!;
}

export async function trainModel(cars: Car[]) {
  const xs = tf.tensor2d(cars.map(car => [
    car.year,
    car.mileage,
    modelToFactor(car.model)
  ]));

  const ys = tf.tensor2d(cars.map(car => [car.price]));

  model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [3], units: 1 }));
  model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });

  await model.fit(xs, ys, { epochs: 100, verbose: 0 });
}

export function calculatePriceScore(car: Car, allCars: Car[]): number {
  if (!model) return 50;

  const input = tf.tensor2d([[car.year, car.mileage, modelToFactor(car.model)]]);
  const prediction = model.predict(input) as tf.Tensor;
  const pred_price = prediction.dataSync()[0];
  const price_dif = pred_price - car.price;

  const diffs = allCars.map(c => {
    const p = model!.predict(tf.tensor2d([[c.year, c.mileage, modelToFactor(c.model)]])) as tf.Tensor;
    return p.dataSync()[0] - c.price;
  });

  const mean = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  const std = Math.sqrt(diffs.reduce((sum, val) => sum + (val - mean) ** 2, 0) / diffs.length);

  let score = ((price_dif - mean) / std) * 10 + 50;
  return Math.min(100, Math.max(0, Math.round(score * 100) / 100));
}