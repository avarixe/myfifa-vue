export default {
  data () {
    return {
      inForm: false,
      valid: false,
      errorMessage: ''
    }
  },
  computed: {
    formError: {
      get: function () { return this.errorMessage.length > 0 },
      set: function (val) { this.errorMessage = val }
    }
  },
  watch: {
    inForm (val) {
      if (!val) {
        Object.assign(this.$data, this.$options.data.apply(this))
        // this.$refs.form.reset()
      }
    }
  },
  methods: {
    numberHint (num) {
      return num && parseInt(num).toLocaleString()
    },
    percentLabel (num) {
      return isNaN(num) ? '0%' : num.toString() + '%'
    }
  }
}
