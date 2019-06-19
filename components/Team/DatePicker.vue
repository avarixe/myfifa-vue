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
          v-on="on"
          color="accent"
          outlined
          dark
        >{{ $_format(currentDate, 'MMM DD, YYYY') }}</v-btn>
      </slot>
    </template>

    <v-date-picker
      v-model="currentDate"
      color="accent"
      :min="seasonStart"
      :max="seasonEnd"
      @input="calendar = false"
    />
  </v-menu>
</template>

<script>
  import { mixins, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import { format, parse, addYears } from 'date-fns'

  @Component
  export default class TeamDatePicker extends mixins(TeamAccessible) {
    @Prop({ type: String, default: 'd-inline-block' }) menuClass
    @Prop({ type: String, default: 'top left' }) origin

    calendar = false
    currentDate = format(new Date(), 'YYYY-MM-DD')

    get seasonStart () {
      const date = parse(this.team.start_date)
      return format(addYears(date, this.season), 'YYYY-MM-DD')
    }

    get seasonEnd () {
      const date = parse(this.seasonStart)
      return format(addYears(date, 1), 'YYYY-MM-DD')
    }

    @Watch('team', { immediate: true })
    setCurrentDate () {
      this.currentDate = this.team.current_date
    }

    @Watch('currentDate')
    async updateDate (val, oldVal) {
      if (oldVal) {
        await this.$store.dispatch('teams/UPDATE', {
          id: this.team.id,
          current_date: val
        })
        this.calendar = false
      }
    }
  }
</script>
