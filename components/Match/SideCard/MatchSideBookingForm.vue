<script>
  import { reactive, toRef, watchEffect, useStore } from '@nuxtjs/composition-api'
  import { useMatch } from '@/composables'
  import { isRequired } from '@/functions'

  export default {
    name: 'MatchSideBookingForm',
    props: {
      side: { type: String, required: true }
    },
    setup (props, { emit }) {
      const attributes = reactive({
        home: true,
        playerName: '',
        redCard: false
      })

      const side = toRef(props, 'side')
      watchEffect(() => {
        attributes.home = side.value === 'home'
      })

      const store = useStore()
      const { matchId, minute } = useMatch()
      const saveBooking = async () => {
        await store.dispatch('bookings/create', {
          matchId: matchId.value,
          attributes: {
            ...attributes,
            minute: minute.value
          }
        })
        emit('submitted')
      }

      return {
        attributes,
        minute,
        saveBooking,
        rules: {
          playerName: [isRequired('Player')]
        }
      }
    }
  }
</script>

<template>
  <base-form
    :submit="saveBooking"
    @reset="attributes.redCard = false"
  >
    <template #default="{ valid, loading }">
      <div class="pa-2">
        <div class="text-subtitle-2 pb-2">Book Player</div>
        <minute-field v-model.number="minute" />
        <v-text-field
          v-model="attributes.playerName"
          label="Player"
          prepend-icon="mdi-account"
          :rules="rules.playerName"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
        <v-radio-group v-model="attributes.redCard">
          <v-radio
            label="Yellow Card"
            color="orange darken-2"
            :value="false"
          />
          <v-radio
            label="Red Card"
            color="red darken-2"
            :value="true"
          />
        </v-radio-group>
        <div class="d-flex">
          <v-spacer />
          <v-btn
            type="submit"
            :disabled="!valid"
            primary
            text
            :loading="loading"
          >
            Save
          </v-btn>
        </div>
      </div>
    </template>
  </base-form>
</template>
