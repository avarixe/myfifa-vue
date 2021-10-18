<script>
  import { toRef, computed, useStore } from '@nuxtjs/composition-api'

  export default {
    name: 'PlayerAction',
    props: {
      player: { type: Object, required: true }
    },
    setup (props) {
      const store = useStore()
      const player = toRef(props, 'player')

      const injury = computed(() =>
        store.$db().model('Injury')
          .query()
          .where('playerId', player.value.id)
          .last()
      )
      const loan = computed(() =>
        store.$db().model('Loan')
          .query()
          .where('playerId', player.value.id)
          .last()
      )

      return {
        injury,
        loan
      }
    }
  }
</script>

<template>
  <div>
    <player-form :record="player">
      <template #activator="{ on }">
        <tooltip-button
          label="Edit"
          icon="mdi-pencil"
          color="orange"
          :on="on"
        />
      </template>
    </player-form>
    <transfer-form :player="player" />
    <loan-form
      :player="player"
      :record="player.status === 'Loaned' ? loan : null"
    />
    <contract-form :player="player" />
    <template v-if="player.isActive">
      <injury-form
        :player="player"
        :record="player.status === 'Injured' ? injury : null"
      />
      <player-retire :player="player" />
      <player-release :player="player" />
    </template>
    <record-remove
      :record="player"
      store="players"
      :label="player.name"
    />
  </div>
</template>
