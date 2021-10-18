<script>
  import { ref, toRef, watchEffect } from '@nuxtjs/composition-api'
  import { nationalities } from '@/constants'

  export default {
    name: 'NationalityField',
    props: {
      value: { type: [String, Number], default: null },
      label: { type: String, default: 'Nationality' },
      icon: { type: String, default: 'mdi-flag' },
      dense: { type: Boolean, default: false },
      outlined: { type: Boolean, default: false },
      hideDetails: { type: Boolean, default: false }
    },
    setup (props, { emit }) {
      const nationality = ref(null)
      const value = toRef(props, 'value')
      watchEffect(() => {
        nationality.value = value.value
      })

      watchEffect(() => {
        emit('input', nationality.value)
      })

      const items = Object.keys(nationalities).sort()

      return {
        nationality,
        nationalities,
        items
      }
    }
  }
</script>

<template>
  <v-autocomplete
    v-model="nationality"
    :items="items"
    :label="label"
    :prepend-icon="icon"
    :dense="dense"
    :outlined="outlined"
    :hide-details="hideDetails"
    menu-props="auto, offsetY"
  >
    <template #prepend-inner>
      <flag
        v-if="nationality"
        class="mt-1"
        :iso="nationalities[nationality]"
      />
    </template>
    <template #item="{ item }">
      <v-list-item-avatar size="20">
        <flag :iso="nationalities[item]" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ item }}</v-list-item-title>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>
