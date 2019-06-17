import { Vue, Component, Watch } from 'vue-property-decorator'
import DialogForm from '@/helpers/DialogForm'

@Component({
  components: {
    DialogForm
  },
  props: {
    color: String
  }
})
export default class DialogFormable extends Vue {
  dialog = false

  @Watch('dialog')
  resetForm (val) {
    if (!val) {
      Object.assign(this.$data, this.$options.data.apply(this))
      // this.$refs.form.reset()
    }
  }
}
