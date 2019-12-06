<template>
  <v-menu
    v-model="calendar"
    :close-on-content-click="false"
    transition="scale-transition"
    :origin="origin"
    :class="menuClass"
  >
    <template #activator="{ on }">
      <slot
        :on="on"
        :date="currentDate"
      >
        <v-btn
          color="cyan"
          dark
          v-on="on"
          v-text="formattedDate"
        />
      </slot>
    </template>

    <v-date-picker
      v-model="currentDate"
      color="cyan"
      :min="seasonStart"
      :max="seasonEnd"
      @input="calendar = false"
    />
  </v-menu>
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import { format, parseISO } from 'date-fns'
  import { TeamAccessible } from '@/mixins'

  const teams = namespace('teams')

  @Component
  export default class TeamDatePicker extends mixins(TeamAccessible) {
    @teams.Action('UPDATE') updateTeam
    @Prop({ type: String, default: 'd-inline-block' }) menuClass
    @Prop({ type: String, default: 'top left' }) origin

    calendar = false
    currentDate = format(new Date(), 'yyyy-MM-dd')

    get formattedDate () {
      return format(parseISO(this.currentDate), 'MMM dd, yyyy')
    }

    @Watch('team', { immediate: true })
    setCurrentDate () {
      this.currentDate = this.team.currently_on
    }

    @Watch('currentDate')
    async updateDate (val, oldVal) {
      if (oldVal) {
        await this.updateTeam({
          id: this.team.id,
          currently_on: val
        })
        this.calendar = false
      }
    }
  }
</script>
