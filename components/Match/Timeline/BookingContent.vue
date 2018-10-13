<template>
  <table>
    <tbody>
      <tr>
        <td class="font-weight-bold">Player</td>
        <td class="pl-1">{{ item.player_name }}</td>
      </tr>
    </tbody>
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
