export default function (array, options = {}) {
  const { key, itemFormatter } = { key: 'id', ...options }
  return array.reduce((arr, item) => {
    if (itemFormatter) {
      item = itemFormatter(item)
    }
    arr[item[key]] = item
    return arr
  }, {})
}
