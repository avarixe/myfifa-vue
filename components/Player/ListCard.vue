<template>
  <v-card outlined>
    <v-card-title :class="`subtitle-1 d-block text-xs-center`">
      <span :class="`${color}--text font-weight-light`">{{ title }}</span>
    </v-card-title>

    <v-divider class="mx-3" />

    <v-simple-table>
      <thead>
        <th class="text-xs-center">Player</th>
        <th class="text-xs-center">Position</th>
        <th
          v-for="(attribute, i) in attributes"
          :key="i"
          class="text-xs-center"
        >{{ attribute.text }}</th>
      </thead>
      <tbody class="text-xs-center">
        <tr
          v-for="player in players"
          :key="player.id"
        >
          <td>
            <v-dialog width="500">
              <template #activator="{ on }">
                <a
                  v-on="on"
                  :class="`my-0 ${color}--text`"
                >
                  <badged-link
                    :text="player.name"
                    :hint="`View ${player.name}`"
                    :color="color"
                  />
                </a>
              </template>

              <player-card
                :player-id="player.id"
                :color="color"
              />
            </v-dialog>
          </td>
          <td>{{ player.pos }}</td>
          <td
            v-for="(attribute, i) in attributes"
            :key="i"
          >
            {{ player[attribute.value] }}
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-card>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import PlayerCard from './Card'
  import { BadgedLink } from '@/helpers'

  @Component({
    components: {
      BadgedLink,
      PlayerCard
    }
  })
  export default class PlayersListCard extends Vue {
    @Prop({ type: Array, default: [] }) players
    @Prop({ type: String, default: 'primary' }) color
    @Prop(String) title
    @Prop({ type: Array, default: [] }) attributes
  }
</script>
