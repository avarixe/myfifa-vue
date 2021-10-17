<script>
  import { ref, reactive, toRef, watchEffect, useStore } from '@nuxtjs/composition-api'
  import { useMatch, useTeam } from '@/composables'
  import { isRequired } from '@/functions'

  export default {
    name: 'BookingForm',
    props: {
      record: { type: Object, default: null }
    },
    setup (props) {
      const attributes = reactive({
        home: true,
        playerId: null,
        playerName: '',
        redCard: false
      })

      const dialog = ref(false)
      const title = ref('')
      const record = toRef(props, 'record')
      const { minute, match, unsubbedPlayers } = useMatch()
      watchEffect(() => {
        if (dialog.value) {
          if (record.value) {
            attributes.home = record.value.home
            attributes.playerId = record.value.playerId
            attributes.playerName = record.value.playerName
            attributes.redCard = record.value.redCard
            minute.value = record.value.minute
            title.value = 'Edit Booking'
          } else {
            attributes.redCard = false
            title.value = 'New Booking'
          }
        }
      })

      const clearNames = () => {
        attributes.playerId = null
        attributes.playerName = null
      }

      const store = useStore()
      const submit = async () => {
        const fullAttributes = {
          ...attributes,
          minute: minute.value
        }

        if (record.value) {
          await store.dispatch('bookings/update', {
            id: record.value.id,
            attributes: fullAttributes
          })
        } else {
          await store.dispatch('bookings/create', {
            matchId: match.value.id,
            attributes: fullAttributes
          })
        }
      }

      const { team } = useTeam()
      return {
        dialog,
        attributes,
        minute,
        title,
        team,
        match,
        rulesFor: {
          playerName: [isRequired('Player')]
        },
        clearNames,
        submit,
        unsubbedPlayers
      }
    }
  }
</script>

<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-book"
    :title="title"
    :submit="submit"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
      />
    </template>
    <template #form>
      <v-col cols="12">
        <v-radio-group
          v-model="attributes.home"
          row
          hide-details
          @change="clearNames"
        >
          <v-radio
            :label="match.home"
            :value="true"
            color="teal"
          />
          <v-radio
            :label="match.away"
            :value="false"
            color="pink"
          />
        </v-radio-group>
      </v-col>
      <v-col cols="12">
        <minute-field v-model.number="minute" />
      </v-col>
      <v-col cols="12">
        <cap-select
          v-if="!attributes.home ^ match.home === team.name"
          v-model="attributes.playerId"
          :caps="unsubbedPlayers"
          required
        />
        <v-text-field
          v-else
          v-model="attributes.playerName"
          label="Player"
          prepend-icon="mdi-account"
          :rules="rulesFor.playerName"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-radio-group
          v-model="attributes.redCard"
          row
          hide-details
        >
          <v-radio
            label="Yellow Card"
            :value="false"
            color="orange darken-2"
          />
          <v-radio
            label="Red Card"
            :value="true"
            color="red darken-2"
          />
        </v-radio-group>
      </v-col>
    </template>
  </dialog-form>
</template>
