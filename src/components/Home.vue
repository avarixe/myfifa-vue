<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm6 class="text-xs-center text-sm-right">
        <v-btn large router to="/teams" class="info">View Teams</v-btn>
      </v-flex>
      <v-flex xs12 sm6 class="text-xs-center text-sm-left">
        <v-btn large router to="/players" class="info">View Players</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-carousel v-if="items.length > 0">
          <v-carousel-item
            v-for="(item,i) in items"
            :src="item.src"
            :key="i"
          >
          </v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        items: [
          // { src: 'https://i2-prod.walesonline.co.uk/incoming/article13561675.ece/ALTERNATES/s615b/FIFA1.png' }
        ]
      }
    }
  }
</script>