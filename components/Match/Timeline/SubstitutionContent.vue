<template>
  <div>
    <span class="font-weight-bold">{{ item.player_name }}</span>
    {{ action }}
    <span class="font-weight-bold">{{ item.replaced_by }}</span>
  </div>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'

  @Component
  export default class SubstitutionContent extends Vue {
    @Prop({ type: Object, required: true }) item

    get action () {
      return this.item.injured
        ? 'has been injured. Replaced by'
        : 'replaced by'
    }
  }
</script>
