import DialogForm from '@/components/DialogForm'

export default {
  components: {
    'dialog-form': DialogForm
  },
  props: {
    color: String
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
