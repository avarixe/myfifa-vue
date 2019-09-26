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
        >
          {{ $_format(currentDate, 'MMM DD, YYYY') }}
        </v-btn>
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
  import { mixins, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import { format } from 'date-fns'

  @Component
  export default class TeamDatePicker extends mixins(TeamAccessible) {
    @Prop({ type: String, default: 'd-inline-block' }) menuClass
    @Prop({ type: String, default: 'top left' }) origin

    calendar = false
    currentDate = format(new Date(), 'YYYY-MM-DD')

    @Watch('team', { immediate: true })
    setCurrentDate () {
      this.currentDate = this.team.currently_on
    }

    @Watch('currentDate')
    async updateDate (val, oldVal) {
      if (oldVal) {
        await this.$store.dispatch('teams/UPDATE', {
          id: this.team.id,
          currently_on: val
        })
        this.calendar = false
      }
    }
  }
</script>
