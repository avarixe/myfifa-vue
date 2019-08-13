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
}
