<script>
  import { ref, toRef, useStore } from '@nuxtjs/composition-api'
  import { useTeam } from '@/composables'

  export default {
    name: 'LoanBuyOptionActivator',
    props: {
      player: { type: Object, required: true },
      loan: { type: Object, required: true }
    },
    setup (props) {
      const dialog = ref(false)
      const loading = ref(false)
      const error = ref(false)
      const errorMessage = ref('')
      const store = useStore()
      const loan = toRef(props, 'loan')
      const { team } = useTeam()
      const activateBuyOption = async () => {
        try {
          loading.value = true
          await store.dispatch('loans/update', {
            id: loan.value.id,
            attributes: {
              signedOn: loan.value.signedOn,
              startedOn: loan.value.startedOn,
              wage: loan.value.wage,
              origin: loan.value.origin,
              destination: loan.value.destination,
              endedOn: team.value.currentlyOn,
              activatedBuyOption: true
            }
          })
          dialog.value = false
        } catch (e) {
          errorMessage.value = e.message
          error.value = true
        } finally {
          loading.value = false
        }
      }

      return {
        dialog,
        loading,
        error,
        errorMessage,
        activateBuyOption
      }
    }
  }
</script>

<template>
  <v-dialog
    v-model="dialog"
    :persistent="loading"
    max-width="500px"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
      />
    </template>
    <v-card>
      <v-card-title>
        <v-toolbar-title>
          <v-icon
            dark
            left
          >
            mdi-airplane
          </v-icon>
          Confirm Action
        </v-toolbar-title>
      </v-card-title>
      <v-card-text class="pt-4 pb-0">
        Activate Loan-to-Buy Option for {{ player.name }}?
      </v-card-text>
      <v-alert
        v-model="error"
        type="error"
        dismissible
        tile
      >
        {{ errorMessage }}
      </v-alert>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          :disabled="loading"
          @click="dialog = false"
        >
          No
        </v-btn>
        <v-btn
          text
          color="red"
          :loading="loading"
          @click="activateBuyOption"
        >
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
