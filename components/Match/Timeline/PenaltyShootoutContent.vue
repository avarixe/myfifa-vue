<template>
  <table>
    <tbody>
      <tr>
        <td class="font-weight-bold">Results</td>
        <td class="pl-1">{{ item.home_score }} - {{ item.away_score }}</td>
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
