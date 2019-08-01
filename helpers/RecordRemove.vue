<template>
  <div
    class="d-inline-block"
    @click.stop="snackbar = true"
  >
    <slot>
      <tooltip-button
        icon="mdi-delete"
        :label="`Remove ${label}`"
        small
      />
    </slot>

    <v-snackbar
      v-model="snackbar"
      color="black"
    >
      Remove {{ label }}?
      <v-btn
        dark
        text
        @click="remove"
      >
        Yes
      </v-btn>
      <v-btn
        dark
        text
        @click.stop="snackbar = false"
      >
        No
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import { Vue, Prop, Component } from 'nuxt-property-decorator'
  import TooltipButton from './TooltipButton'

  @Component({
    components: {
      TooltipButton
    }
  })
  export default class RecordRemove extends Vue {
    @Prop({ type: Object, required: true }) record
    @Prop({ type: String, required: true }) store
    @Prop([String, Object]) redirect
    @Prop(String) label
    @Prop({ type: Boolean, default: false }) small

    snackbar = false

    remove () {
      this.$store.dispatch(
        `${this.store}/REMOVE`,
        this.record.id
      )

      if (this.redirect) {
        this.$router.push(this.redirect)
      }
    }
  }
</script>
