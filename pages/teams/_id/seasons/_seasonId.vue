<template>
  <div>SEASON</div>
</template>

<script>
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    mixins: [ TeamAccessible ],
    async fetch ({ store, params }) {
      if (store.state.team.currentId !== params.id) {
        await store.dispatch('team/get', { teamId: params.id, activate: true })
      }
    }
  }
</script>
