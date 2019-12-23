<template lang="pug">
  div
    span.font-weight-bold {{ item.player_name }}
    |&nbsp;
    | {{ action }}
    |&nbsp;
    span.font-weight-bold {{ item.replaced_by }}
</template>

<script>
  export default {
    name: 'SubstitutionContent',
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    computed: {
      action () {
        return this.item.injured
          ? 'has been injured. Replaced by'
          : 'replaced by'
      }
    }
  }
</script>
