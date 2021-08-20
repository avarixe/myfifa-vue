<template>
  <v-combobox
    v-bind="$attrs"
    :items="items"
    :search-input.sync="searchInput"
    :loading="loading"
    spellcheck="false"
    autocapitalize="words"
    autocomplete="off"
    autocorrect="off"
    v-on="$listeners"
    @update:search-input="onSearchInputUpdate"
  />
</template>

<script>
  import { gql } from 'nuxt-graphql-request'

  export default {
    name: 'TeamCombobox',
    data: () => ({
      timeout: null,
      loading: false,
      searchInput: null,
      items: []
    }),
    beforeDestroy () {
      clearTimeout(this.timeout)
    },
    methods: {
      onSearchInputUpdate () {
        clearTimeout(this.timeout)
        if (this.searchInput && this.searchInput.length >= 3) {
          this.timeout = setTimeout(this.searchItems, 300)
        } else {
          this.items = []
        }
      },
      async searchItems () {
        try {
          this.loading = true

          const query = gql`
            query fetchTeamNames($search: String) {
              teamNames(search: $search)
            }
          `

          const { teamNames } = await this.$graphql.default.request(query, {
            search: this.searchInput
          })

          this.items = teamNames
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
