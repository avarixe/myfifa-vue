export function sum (array) {
  return array.reduce((total, num) => total + num, 0)
}

export function requiredRule (options) {
  options.label = options.label || 'Field'
  return v => !!v || `${options.label} is required`
}

export function rangeRule (options) {
  options.label = options.label || 'Field'
  return v => (
    (!isNaN(v) && options.min <= parseFloat(v) && parseFloat(v) <= options.max) ||
    `${options.label} must be between ${options.min} and ${options.max}`
  )
}

export function formatRule (options) {
  options.label = options.label || 'Field'
  const error = `${options.label} must be valid`
  switch (options.type) {
    case 'email':
      return v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || error
    case 'date':
      return v => /^\d{4}-\d{2}-\d{2}$/.test(v) || error
    case 'number':
      return v => !v || /^\d+$/.test(v) || error
  }
}
