<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :submit-cb="submitCb"
    :color="color">
    <slot slot="activator"></slot>
    <v-container slot="form">
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field
            v-model="player.name"
            :rules="$_validate('Name', ['required'])"
            label="Name"
            prepend-icon="person"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-select
            v-model="player.pos"
            :rules="$_validate('Position', ['required'])"
            :items="positions"
            label="Position"
            prepend-icon="directions_run"
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <v-select
            v-model="player.sec_pos"
            :items="positions"
            label="Secondary Position(s)"
            prepend-icon="directions_walk"
            multiple
            chips
            deletable-chips
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model="player.birth_year"
            label="Birth Year"
            prepend-icon="date_range"
            mask="####"
            :rules="$_validate('Birth Year', ['required'])"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-select
            v-model="player.ovr"
            :items="Array.from({ length: 61 }, (v, k) => k + 40)"
            :rules="$_validate('OVR', ['required'])"
            label="OVR"
            prepend-icon="trending_up"
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model="player.value"
            :rules="$_validate('Value', ['required'])"
            type="number"
            label="Value"
            :prefix="team.currency"
            :hint="$_numberHint(player.value)"
            persistent-hint
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-checkbox
            label="Youth Player"
            v-model="player.youth"
            :disabled="player.id > 0"
            hide-details
          ></v-checkbox>
        </v-flex>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import FormBase from '@/mixins/FormBase'
  import TeamAction from '@/mixins/TeamAction'

  export default {
    mixins: [
      FormBase,
      TeamAction
    ],
    props: {
      initialPlayer: Object,
      submitCb: Function
    },
    data () {
      return {
        valid: !!this.initialPlayer,
        player: Object.assign({
          id: '',
          name: '',
          pos: '',
          sec_pos: [],
          ovr: null,
          value: null,
          age: 16,
          youth: false
        }, this.initialPlayer)
      }
    },
    computed: {
      ...mapState('player', [
        'positions'
      ]),
      title () {
        return this.player.id ? 'Edit ' + this.player.name : 'New Player'
      }
    },
    methods: {
      ...mapActions('player', [
        'create',
        'update'
      ]),
      async submit () {
        if (this.initialPlayer) {
          await this.update(this.player)
        } else {
          const { data } = await this.create({
            teamId: this.team.id,
            player: this.player
          })
          this.$router.push({
            name: 'players-id',
            params: { id: data.id }
          })
        }
      }
    }
  }
</script>
