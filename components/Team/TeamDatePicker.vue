<template>
  <v-menu
    v-model="calendar"
    :close-on-content-click="false"
    transition="scale-transition"
    origin="top left"
    class="d-inline-block"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <v-list-item
          v-ripple
          v-on="on"
          color="accent"
          class="v-list-item"
          style="width: 100%"
        >
          <v-list-item-action>
            <v-icon>mdi-calendar</v-icon>
          </v-list-item-action>
          <v-list-item-title>
            {{ $_format(currentDate, 'MMM DD, YYYY') }}
          </v-list-item-title>
        </v-list-item>
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
  import { TeamAccessible } from '@/mixins'

  export default {
    mixins: [
      TeamAccessible
    ],
    data () {
      return {
        calendar: false,
        currentDate: this.$_format(new Date())
      }
    },
    watch: {
      team: {
        immediate: true,
        handler (val) {
          this.currentDate = this.team.current_date
        }
      },
      async currentDate (val, oldVal) {
        if (oldVal) {
          await this.$store.dispatch('teams/UPDATE', {
            id: this.team.id,
            current_date: val
          })
          this.calendar = false
        }
      }
    }
  }
</script>
