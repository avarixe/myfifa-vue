<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout
      row
      wrap
    >
      <v-flex
        xs12
      >
        <v-card>
          <v-card-title
            primary-title
          >
            <div
              class="display-2"
              v-text="team.title"
            />
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    mixins: [ TeamAccessible ],
    head () {
      return {
        title: this.team.title
      }
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    }
  }
</script>