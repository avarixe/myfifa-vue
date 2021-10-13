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
    name: 'CompetitionCombobox',
    props: {
      defaultItems: { type: Array, default: () => [] }
    },
    data: () => ({
      timeout: null,
      loading: false,
      searchInput: null,
      items: []
    }),
    watch: {
      defaultItems: {
        immediate: true,
        deep: true,
        handler (items) {
          this.items = items
        }
      }
    },
    beforeDestroy () {
      clearTimeout(this.timeout)
    },
    methods: {
      onSearchInputUpdate () {
        clearTimeout(this.timeout)
        if (this.searchInput && this.searchInput.length >= 3) {
          if (this.searchInput !== this.$attrs.value) {
            this.timeout = setTimeout(this.searchItems, 300)
          }
        } else {
          this.items = this.defaultItems
        }
      },
      async searchItems () {
        try {
          this.loading = true

          const query = gql`
            query fetchCompetitionOptions($category: OptionCategory!, $search: String) {
              options(category: $category, search: $search)
            }
          `

          const { options } = await this.$graphql.default.request(query, {
            category: 'Competition',
            search: this.searchInput
          })

          this.items = options
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
