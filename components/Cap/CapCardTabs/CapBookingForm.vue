<script>
  import { reactive, toRef, watchEffect, useStore } from '@nuxtjs/composition-api'
  import { useMatch } from '@/composables'

  export default {
    name: 'CapBookingForm',
    props: {
      cap: { type: Object, required: true }
    },
    setup (props, { emit }) {
      const attributes = reactive({
        home: true,
        playerId: null,
        playerName: '',
        redCard: false
      })

      const { matchId, minute, isTeamHome } = useMatch()

      const cap = toRef(props, 'cap')
      watchEffect(() => {
        attributes.playerId = cap.value.playerId
        attributes.playerName = cap.value.name
        attributes.home = isTeamHome.value
      })

      const store = useStore()
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
        saveBooking
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
        <div class="text-subtitle-2 pb-2">
          Book Player
        </div>
        <minute-field v-model.number="minute" />
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
