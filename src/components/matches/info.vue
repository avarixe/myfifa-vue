<template>
  <div>
    <v-tabs
      v-model="tab"
      grow>
      <v-tab
        v-for="item in items"
        :key="item"
      >{{ item }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="item in items"
        :key="item">
        <v-card v-if="item === 'details'" flat>
          Events
        </v-card>
        <v-card v-else-if="item === 'lineup'" flat>
          Lineup
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
  export default {
    props: [
      'match'
    ],
    data () {
      return {
        tab: null,
        items: [
          'details',
          'lineup'
        ]
      }
    }
  }
</script>