<template>
  <v-card>
    <v-card-title primary-title>
      <div class="title">
        // MATCHES
      </div>
    </v-card-title>
    <v-card-text>
      {{ teamId }}
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    props: ['teamId'],
    data: () => ({
    })
  }
</script>