<template>
  <v-card outlined>
    <v-card-title :class="`subtitle-1 d-block text-xs-center`">
      <span :class="`${color}--text font-weight-light`">{{ title }}</span>
    </v-card-title>

    <v-divider class="mx-3" />

    <v-simple-table>
      <thead>
        <th>Player</th>
        <th></th>
      </thead>
      <tbody>
        <tr
          v-for="player in players"
          :key="player.id"
        >
          <td>{{ player.name }}</td>
          <td class="text-xs-right">
            <v-dialog width="500">
              <template #activator="{ on }">
                <v-btn
                  v-on="on"
                  :color="color"
                  nuxt
                  dark
                  small
                  outlined
                  class="my-0"
                >View</v-btn>
              </template>

              <player-card
                :player="player"
                :color="color"
              />
            </v-dialog>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-card>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import PlayerCard from './Card'

  @Component({
    components: {
      PlayerCard
    }
  })
  export default class PlayersCard extends Vue {
    @Prop({ type: Array, default: [] }) players
    @Prop({ type: String, default: 'primary' }) color
    @Prop(String) title
  }
</script>
