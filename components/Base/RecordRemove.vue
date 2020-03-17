<template>
  <div
    class="d-inline-block"
    @click.stop="snackbar = true"
  >
    <slot>
      <tooltip-button
        icon="mdi-delete"
        :label="`Remove ${label}`"
        dark
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
  import TooltipButton from './TooltipButton'

  export default {
    name: 'RecordRemove',
    components: {
      TooltipButton
    },
    props: {
      record: { type: Object, required: true },
      store: { type: String, required: true },
      redirect: { type: [String, Object], default: null },
      label: { type: String, default: null }
    },
    data: () => ({
      snackbar: false
    }),
    methods: {
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
  }
</script>
