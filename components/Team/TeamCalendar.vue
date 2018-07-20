<template>
  <v-date-picker
    v-model="currentDate"
    color="blue-grey"
    full-width
    :min="seasonStart"
    :max="seasonEnd"
  ></v-date-picker>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    props: {
      team: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        currentDate: this.team && this.team.current_date
      }
    },
    computed: {
      ...mapGetters('team', [
        'seasonStart',
        'seasonEnd'
      ])
    },
    watch: {
      currentDate (val, oldVal) {
        oldVal && this.update({ id: this.team.id, current_date: val })
      }
    },
    methods: mapActions('team', [ 'update' ])
  }
</script>
