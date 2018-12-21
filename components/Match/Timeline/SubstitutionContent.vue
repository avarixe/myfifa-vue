<template>
  <table>
    <tbody>
      <tr>
        <td class="font-weight-bold">Player</td>
        <td class="pl-1">{{ item.player_name }}</td>
      </tr>
      <tr>
        <td class="font-weight-bold">Replaced By</td>
        <td class="pl-1">{{ item.replaced_by }}</td>
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
