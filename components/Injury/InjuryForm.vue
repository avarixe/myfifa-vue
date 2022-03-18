<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
      >
        <tooltip-button
          :label="title"
          icon="mdi-ambulance"
          color="pink"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <v-col cols="12">
        <v-date-field
          v-model="attributes.startedOn"
          label="Injury Date"
          prepend-icon="mdi-calendar-today"
          required
        />
      </v-col>
      <template v-if="durationOn">
        <v-col cols="6">
          <v-text-field
            v-model.number="attributes.duration['length']"
            label="Length of Duration"
            prepend-icon="mdi-ruler"
            :rules="rulesFor.durationLength"
            inputmode="numeric"
          />
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="attributes.duration.timespan"
            :items="timespans"
            label="Timespan"
            append-outer-icon="mdi-calendar"
            :rules="rulesFor.durationTimespan"
            @click:append-outer="durationOn = false"
          />
        </v-col>
      </template>
      <v-col
        v-else
        cols="12"
      >
        <v-date-field
          v-model="attributes.endedOn"
          label="Recovery Date"
          prepend-icon="mdi-calendar"
          :append-outer-icon="record ? null : 'mdi-ruler'"
          :min="attributes.startedOn"
          :prefill="team.currentlyOn"
          required
          @click:append-outer="durationOn = true"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="attributes.description"
          label="Description"
          prepend-icon="mdi-ambulance"
          :rules="rulesFor.description"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { DialogFormable } from '@/mixins'
  import { isRequired, isNumber } from '@/functions'

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
      attributes: {
        startedOn: null,
        endedOn: null,
        duration: {
          length: null,
          timespan: null
        },
        description: ''
      },
      rulesFor: {
        description: [isRequired('Description')],
        durationLength: [
          isRequired('Length of Duration'),
          isNumber('Length of Duration')
        ],
        durationTimespan: [isRequired('Timespan')]
      },
      timespans: [
        'Days',
        'Weeks',
        'Months',
        'Years'
      ],
      durationOn: false
    }),
    computed: {
      team () {
        return this.$store.$db().model('Team').find(this.$route.params.teamId)
      },
      title () {
        return this.record ? 'Update Injury' : 'Record New Injury'
      }
    },
    watch: {
      dialog (val) {
        if (val) {
          if (this.record) {
            this.attributes = pick(this.record, [
              'startedOn',
              'endedOn',
              'description'
            ])
            this.durationOn = false
          } else {
            this.attributes.startedOn = this.team.currentlyOn
            this.attributes.endedOn = this.team.currentlyOn
            this.durationOn = true
          }
        }
      },
      durationOn (durationOn) {
        if (durationOn) {
          this.$set(this.attributes, 'duration', {
            length: null,
            timespan: null
          })
        } else {
          this.$delete(this.attributes, 'duration')
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
          await this.updateInjury({
            id: this.record.id,
            attributes: this.attributes
          })
        } else {
          await this.createInjury({
            playerId: this.player.id,
            attributes: this.attributes
          })
        }
      }
    }
  }
</script>
