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
  import { TeamAccessible } from '@/mixins'

  export default {
    mixins: [
      TeamAccessible
    ],
    props: {
      menuClass: {
        type: String,
        default: 'd-inline-block'
      },
      origin: {
        type: String,
        default: 'top left'
      }
    },
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
