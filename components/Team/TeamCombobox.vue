<script>
  import { ref, reactive, toRef, watchEffect, useContext, onBeforeUnmount } from '@nuxtjs/composition-api'
  import { gql } from 'nuxt-graphql-request'

  export default {
    name: 'TeamCombobox',
    props: {
      defaultItems: { type: Array, default: () => [] }
    },
    setup (props, { attrs }) {
      const items = reactive({ value: [] })
      const defaultItems = toRef(props, 'defaultItems')
      watchEffect(() => {
        items.value = defaultItems.value
      })

      const { $graphql } = useContext()
      const loading = ref(false)
      const searchInput = ref(null)
      const searchItems = async () => {
        try {
          loading.value = true

          const query = gql`
            query fetchTeamOptions($category: OptionCategory!, $search: String) {
              options(category: $category, search: $search)
            }
          `

          const { options } = await $graphql.default.request(query, {
            category: 'Team',
            search: searchInput.value
          })

          items.value = options
        } catch (e) {
          console.error(e)
        } finally {
          loading.value = false
        }
      }

      const timeout = ref(null)
      onBeforeUnmount(() => clearTimeout(timeout.value))
      const onSearchInputUpdate = () => {
        clearTimeout(timeout.value)
        if (searchInput.value?.length >= 3) {
          if (searchInput.value !== attrs.value) {
            timeout.value = setTimeout(searchItems, 300)
          }
        } else {
          items.value = defaultItems.value
        }
      }

      return {
        loading,
        searchInput,
        items,
        onSearchInputUpdate
      }
    }
  }
</script>

<template>
  <v-combobox
    v-bind="$attrs"
    :items="items.value"
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
