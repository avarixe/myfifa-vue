<template>
  <dialog-form
    v-model="dialog"
    title="Add Cap"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          label="Add Player"
          icon="mdi-plus-circle-outline"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <dynamic-fields :fields="fields">
        <template #field.minute>
          <player-select
            v-model="cap.player_id"
            :players="players"
            item-value="id"
            :disabled="cap.start > 0"
            label="Player"
            required
          />
        </template>
      </dynamic-fields>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import { positions } from '@/models/Match'
  import { activePlayers } from '@/models/Player'
  import { DialogFormable } from '@/mixins'

  export default {
    name: 'CapForm',
    mixins: [
      DialogFormable
    ],
    props: {
      match: { type: Object, required: true }
    },
    data: () => ({
      cap: {
        player_id: null,
        pos: ''
      }
    }),
    computed: {
      fields () {
        return [
          {
            type: 'select',
            object: this.cap,
            attribute: 'pos',
            items: Object.keys(positions),
            label: 'Position',
            prependIcon: 'mdi-run',
            required: true
          },
          { slot: 'minute' }
        ]
      },
      players () {
        return activePlayers(parseInt(this.$route.params.teamId))
      }
    },
    methods: {
      ...mapActions('caps', {
        createCap: 'CREATE'
      }),
      async submit () {
        await this.createCap({
          matchId: this.match.id,
          cap: this.cap
        })
      }
    }
  }
</script>
