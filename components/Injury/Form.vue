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
        <v-tooltip
          bottom
          color="pink"
        >
          <template #activator="{ on: tooltip }">
            <v-btn
              icon
              v-on="{ ...on, ...tooltip }"
            >
              <v-icon color="pink">mdi-hospital</v-icon>
            </v-btn>
          </template>
          {{ title }}
        </v-tooltip>
      </slot>
    </template>

    <template #form>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="injury.description"
              :rules="$_validate('Description', ['required'])"
              label="Description"
              prepend-icon="mdi-hospital"
              spellcheck="false"
              autocapitalize="words"
              autocomplete="off"
              autocorrect="off"
            />
          </v-col>
          <v-scroll-y-transition mode="out-in">
            <v-col
              v-if="playerInjured"
              cols="12"
            >
              <v-checkbox
                v-model="injury.recovered"
                label="Player Recovered"
              />
            </v-col>
          </v-scroll-y-transition>
        </v-row>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { mapActions } from 'vuex'
  import { Injury } from '@/models'
  import { DialogFormable } from '@/mixins'

  @Component({
    methods: mapActions('injuries', {
      create: 'CREATE',
      update: 'UPDATE'
    })
  })
  export default class InjuryForm extends mixins(DialogFormable) {
    @Prop({ type: Object, required: true }) player
    @Prop(String) color
    @Prop(Boolean) dark
    @Prop(Function) submitCb

    injury = {
      description: '',
      recovered: false
    }

    get playerInjured () {
      return this.player.status && this.player.status === 'Injured'
    }

    get title () {
      return this.playerInjured
        ? 'Update Injury'
        : 'Record New Injury'
    }

    get currentInjury () {
      return Injury
        .query()
        .where('player_id', this.player.id)
        .orderBy('started_on')
        .last()
    }

    @Watch('dialog')
    async setInjury (val) {
      if (val) {
        const { id, description } = this.currentInjury
        Object.assign(this.injury, { id, description })
      } else {
        Object.assign(this.$data, this.$options.data.apply(this))
        // this.$refs.form.reset()
      }
    }

    async submit () {
      if (this.playerInjured) {
        await this.update(this.injury)
      } else {
        await this.create({
          playerId: this.player.id,
          injury: this.injury
        })
      }
    }
  }
</script>
