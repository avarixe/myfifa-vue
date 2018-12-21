<template>
  <table>
    <tbody>
      <tr>
        <td class="font-weight-bold">Scorer</td>
        <td class="pl-1">{{ item.player_name }}</td>
      </tr>
      <tr v-if="item.assisted_by">
        <td class="font-weight-bold">Assisted By</td>
        <td class="pl-1">{{ item.assisted_by }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  export default {
    props: {
      item: {
        type: Object,
        required: true
      }
    }
  }
</script>
