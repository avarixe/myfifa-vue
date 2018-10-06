<template>
  <table>
    <tr>
      <td class="font-weight-bold">Results</td>
      <td class="pl-1">{{ item.home_score }} - {{ item.away_score }}</td>
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
