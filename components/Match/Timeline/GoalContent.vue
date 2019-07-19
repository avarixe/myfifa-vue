<template>
  <div>
    {{ goalType }} scored by
    <span class="font-weight-bold">{{ item.player_name }}</span>
    <span v-if="item.assisted_by">
      (assisted by
      <span class="font-weight-bold">{{ item.assisted_by }}</span>
      )
    </span>
  </div>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'

  @Component
  export default class GoalContent extends Vue {
    @Prop({ type: Object, required: true }) item

    get goalType () {
      if (this.item.penalty) {
        return 'Penalty'
      } else if (this.item.own_goal) {
        return 'Own Goal'
      } else {
        return 'Goal'
      }
    }
  }
</script>
