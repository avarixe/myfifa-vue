export default {
  methods: {
    numberHint (num) {
      return num && parseInt(num).toLocaleString()
    },
    percentLabel (num) {
      return isNaN(num) ? '0%' : num.toString() + '%'
    }
  }
}
