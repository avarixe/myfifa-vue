export default {
  props: {
    color: {
      type: String,
      default: 'white'
    }
  },
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
    },
    buttonColor () {
      return this.color ? this.color + ' darken-2' : null
    },
    formColor () {
      return this.color ? this.color + ' accent-2' : null
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
    $_numberHint (num) {
      return num && parseInt(num).toLocaleString()
    }
  }
}
