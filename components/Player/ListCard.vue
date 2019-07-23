<template>
  <v-card outlined>
    <v-card-title :class="`subtitle-1 d-block text-center`">
      <span :class="`${color}--text font-weight-light`">{{ title }}</span>
    </v-card-title>

    <v-divider class="mx-3" />

    <v-simple-table>
      <thead>
        <th class="text-center">Player</th>
        <th class="text-center">Position</th>
        <th
          v-for="(attribute, i) in attributes"
          :key="i"
          class="text-center"
          v-text="attribute.text"
        />
      </thead>
      <tbody class="text-center">
        <tr
          v-for="player in players"
          :key="player.id"
        >
          <td>
            <v-dialog width="500">
              <template #activator="{ on }">
                <a
                  :class="`my-0 ${color}--text`"
                  v-on="on"
                >{{ player.name }}</a>
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
            v-text="player[attribute.value]"
          />
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
  export default class PlayersListCard extends Vue {
    @Prop({ type: Array, default: [] }) players
    @Prop({ type: String, default: 'primary' }) color
    @Prop(String) title
    @Prop({ type: Array, default: [] }) attributes
  }
</script>
