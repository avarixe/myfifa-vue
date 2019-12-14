<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :submit-cb="submitCb"
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
      <template v-if="record && record.ended_on">
        <v-col cols="12">
          <v-date-field
            v-model="injury.started_on"
            v-rules.required
            label="Injury Date"
            prepend-icon="mdi-calendar-today"
            color="pink"
            required
          />
        </v-col>
        <v-col cols="12">
          <v-date-field
            v-model="injury.ended_on"
            v-rules.required
            label="Recovery Date"
            prepend-icon="mdi-calendar-today"
            color="pink"
            required
          />
        </v-col>
      </template>
      <v-col cols="12">
        <v-text-field
          v-model="injury.description"
          v-rules.required
          label="Description"
          prepend-icon="mdi-ambulance"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-scroll-y-transition mode="out-in">
        <v-col
          v-if="record && !record.ended_on"
          cols="12"
        >
          <v-checkbox
            v-model="injury.recovered"
            label="Player Recovered"
          />
        </v-col>
      </v-scroll-y-transition>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import pick from 'lodash.pick'
  import { DialogFormable } from '@/mixins'
  import { TooltipButton, VDateField } from '@/helpers'

  const injuries = namespace('injuries')

  @Component({
    components: {
      TooltipButton,
      VDateField
    }
  })
  export default class InjuryForm extends mixins(DialogFormable) {
    @injuries.Action('CREATE') createInjury
    @injuries.Action('UPDATE') updateInjury
    @Prop({ type: Object, required: true }) player
    @Prop(Object) record
    @Prop(String) color
    @Prop(Boolean) dark
    @Prop(Function) submitCb

    injury = {
      description: '',
      recovered: false
    }

    get title () {
      return this.record
        ? 'Update Injury'
        : 'Record New Injury'
    }

    @Watch('dialog')
    async setInjury (val) {
      if (val && this.record) {
        this.injury = pick(this.record, [
          'id',
          'started_on',
          'ended_on',
          'description'
        ])
      }
    }

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
</script>
