import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator'
import DialogForm from '@/helpers/DialogForm'

@Component({
  components: {
    DialogForm
  }
})
export default class DialogFormable extends Vue {
  @Prop(String) color

  dialog = false

  @Watch('dialog')
  resetForm (val) {
    if (!val) {
      Object.assign(this.$data, this.$options.data.apply(this))
      // this.$refs.form.reset()
    }
  }
}
