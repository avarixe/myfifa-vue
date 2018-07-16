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
  import { mapActions, mapGetters } from 'vuex'

  export default {
    data () {
      return {
        teamId: this.$route.params.teamId,
        currentDate: null
      }
    },
    computed: mapGetters('team', [
      'seasonStart',
      'seasonEnd'
    ]),
    watch: {
      currentDate (val, oldVal) {
        oldVal && this.update({ id: this.teamId, current_date: val })
      }
    },
    methods: mapActions('team', [
      'get',
      'update'
    ]),
    mounted () {
      this.get({ teamId: this.teamId, activate: true })
        .then((data) => { this.currentDate = data.current_date })
    }
  }
</script>
