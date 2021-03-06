<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    color="pink"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          :label="title"
          icon="mdi-ambulance"
          color="pink"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <v-row
        v-if="record && record.ended_on"
        dense
      >
        <v-col cols="12">
          <v-date-field
            v-model="injury.started_on"
            label="Injury Date"
            prepend-icon="mdi-calendar-today"
            color="pink"
            :max="contract && contract.ended_on"
            required
          />
        </v-col>
        <v-col cols="12">
          <v-date-field
            v-model="injury.ended_on"
            label="Recovery Date"
            prepend-icon="mdi-calendar"
            color="pink"
            :min="contract && contract.started_on"
            required
          />
        </v-col>
      </v-row>
      <v-col cols="12">
        <v-text-field
          v-model="injury.description"
          label="Description"
          prepend-icon="mdi-ambulance"
          :rules="rulesFor.description"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col
        v-if="record && !record.ended_on"
        cols="12"
      >
        <v-checkbox
          v-model="injury.recovered"
          label="Player Recovered"
          hide-details
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { DialogFormable } from '@/mixins'
  import { isRequired } from '@/functions'

  export default {
    name: 'InjuryForm',
    mixins: [
      DialogFormable
    ],
    props: {
      player: { type: Object, required: true },
      record: { type: Object, default: null },
      color: { type: String, default: null },
      dark: { type: Boolean, default: false }
    },
    data: () => ({
      injury: {
        description: '',
        recovered: false
      },
      rulesFor: {
        description: [isRequired('Description')]
      }
    }),
    computed: {
      title () {
        return this.record ? 'Update Injury' : 'Record New Injury'
      }
    },
    watch: {
      dialog (val) {
        if (val && this.record) {
          this.injury = pick(this.record, [
            'id',
            'started_on',
            'ended_on',
            'description'
          ])
        }
      }
    },
    methods: {
      ...mapActions('injuries', {
        createInjury: 'create',
        updateInjury: 'update'
      }),
      async submit () {
        if (this.record) {
          await this.updateInjury(this.injury)
        } else {
          await this.createInjury({
            playerId: this.player.id,
            injury: this.injury
          })
        }
      }
    }
  }
</script>
