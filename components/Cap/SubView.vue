<template lang="pug">
  v-list-item
    v-list-item-action.font-weight-bold
      inline-select(
        :item="cap"
        attribute="pos"
        input-type="select"
        :label="`${cap.name} Position`"
        :options="positions"
        :readonly="readonly"
        @change="setPosition($event)"
      )
    v-dialog(v-if="readonly" width="500")
      template(#activator="{ on }")
        a.font-weight-light.body-2.mr-4(style="color: inherit" v-on="on")
          | {{ cap.name }}
      player-card(:player-id="cap.player_id")
    span.font-weight-light.body-2.mr-4(v-else) {{ cap.name }}
    cap-events.d-inline-block(:cap="cap" :match="match")
</template>

<script>
  import { mapActions } from 'vuex'
  import { positions } from '@/models/Match'
  import CapEvents from './Events'
  import PlayerCard from '@/components/Player/Card'

  export default {
    name: 'CapSubView',
    components: {
      CapEvents,
      PlayerCard
    },
    props: {
      cap: {
        type: Object,
        required: true
      },
      match: {
        type: Object,
        required: true
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      positions () {
        return Object.keys(positions)
      }
    },
    methods: {
      ...mapActions('caps', {
        updateCap: 'UPDATE'
      }),
      setPosition (position) {
        this.updateCap({
          ...this.cap,
          pos: position
        })
      }
    }
  }
</script>
