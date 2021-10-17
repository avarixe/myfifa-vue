<script>
  import { ref, reactive, toRef, watchEffect, useStore } from '@nuxtjs/composition-api'
  import { useMatch } from '@/composables'
  import { isRequired, isNumber } from '@/functions'

  export default {
    name: 'PenaltyShootoutForm',
    props: {
      record: { type: Object, default: null }
    },
    setup (props) {
      const attributes = reactive({
        homeScore: null,
        awayScore: null
      })

      const dialog = ref(false)
      const record = toRef(props, 'record')
      const title = ref('Record Penalty Shootout')
      watchEffect(() => {
        if (dialog.value && record.value) {
          attributes.homeScore = record.value.homeScore
          attributes.awayScore = record.value.awayScore
          title.value = 'Edit Penalty Shootout'
        }
      })

      const store = useStore()
      const { matchId } = useMatch()
      const submit = async () => {
        await store.dispatch('penaltyShootout/save', {
          matchId: matchId.value,
          attributes
        })
      }

      return {
        attributes,
        dialog,
        title,
        submit,
        rulesFor: {
          homeScore: [
            isRequired('Home Score'),
            isNumber('Home Score')
          ],
          awayScore: [
            isRequired('Away Score'),
            isNumber('Away Score')
          ]
        }
      }
    }
  }
</script>

<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-human"
    :title="title"
    :submit="submit"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
      >
        <tooltip-button
          label="Record Penalty Shootout"
          icon="mdi-human"
          color="indigo"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <v-col cols="6">
        <v-text-field
          v-model.number="attributes.homeScore"
          label="Home Score"
          prepend-icon="mdi-soccer"
          :rules="rulesFor.homeScore"
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model.number="attributes.awayScore"
          label="Away Score"
          prepend-icon="mdi-soccer"
          :rules="rulesFor.awayScore"
          inputmode="numeric"
        />
      </v-col>
    </template>
  </dialog-form>
</template>
