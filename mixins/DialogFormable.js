import DialogForm from '@/helpers/DialogForm'

export default {
  components: {
    DialogForm
  },
  props: {
    color: String,
    default: 'tertiary'
  },
  data: () => ({
    dialog: false
  }),
  watch: {
    dialog (val) {
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
