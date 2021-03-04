export function isRequired (label) {
  return v => !!v || `${label || 'Field'} is required`
}

export function isNumber (label) {
  return v => !v || /^\d+$/.test(v) || `${label || 'Field'} is not a number`
}

export function isEmail (v) {
  const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  return !v || regex.test(v) || 'Please enter a valid email address'
}

export function inRange (label, [min, max]) {
  return v => (
    !v ||
    (!isNaN(v) && min <= parseFloat(v) && parseFloat(v) <= max) ||
    `${label || 'Field'} must be between ${min} and ${max}`
  )
}
