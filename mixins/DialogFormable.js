import DialogForm from '@/helpers/DialogForm'

export default {
  components: {
    DialogForm
  },
  props: {
    color: String
  },
  data: () => ({
    dialog: false
  })
}
