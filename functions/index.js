export * from './rules'

export function sum (array) {
  return array.reduce((total, num) => total + num, 0)
}
