<template>
  <v-container fluid fill-height>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex
          xs12
          sm6
          md4
          v-for="(item, i) in items"
          :key="i">
          <v-card>
            <v-card-media v-if="item.src" :src="item.src" height="200px">
            </v-card-media>
            <v-card-actions>
              <div>
                <h3 class="headline mb-0">{{ item.title }}</h3>
                <div v-if="item.subtitle">{{ item.subtitle }}</div>
              </div>
              <v-spacer></v-spacer>
              <v-btn icon router :to="item.href">
                <v-icon>arrow_forward</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      items: [
        { title: 'Squad',  subtitle: 'Manage Players',            href: '/players', src: '/static/squad.jpg' },
        { title: 'Season', subtitle: 'Record and Review Matches', href: '/season',  src: '/static/season.jpg' }
      ]
    })
  }
</script>