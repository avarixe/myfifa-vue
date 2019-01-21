<template>
  <div>
    {{ goalType }} scored by
    <span
      class="font-weight-bold"
      v-text="item.player_name"
    />
    <span
      v-if="item.assisted_by"
    >
      (assisted by
      <span
        class="font-weight-bold"
        v-text="item.assisted_by"
      />
      )
    </span>
  </div>
</template>

<script>
  export default {
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
