<template lang="pug">
  div
    | {{ goalType }} scored by
    |&nbsp;
    span.font-weight-bold {{ item.player_name }}
    |&nbsp;
    span(v-if="item.assisted_by")
      | (assisted by
      |&nbsp;
      span.font-weight-bold {{ item.assisted_by }}
      | )
</template>

<script>
  export default {
    name: 'GoalContent',
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    computed: {
      goalType () {
        if (this.item.penalty) {
          return 'Penalty'
        } else if (this.item.own_goal) {
          return 'Own Goal'
        } else {
          return 'Goal'
        }
      }
    }
  }
</script>
