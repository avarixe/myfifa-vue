<template>
  <table>
    <tr>
      <td class="font-weight-bold">Scorer</td>
      <td class="pl-1">{{ item.player_name }}</td>
    </tr>
    <tr v-if="item.assisted_by">
      <td class="font-weight-bold">Assisted By</td>
      <td class="pl-1">{{ item.assisted_by }}</td>
    </tr>
  </table>
</template>

<script>
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    mixins: [ TeamAccessible ],
    props: {
      item: {
        type: Object,
        required: true
      }
    }
  }
</script>
