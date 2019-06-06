<template>
  <v-menu
    :disabled="disabled"
    max-height="200px"
    offset-y
    offset-overflow
  >
    <template #activator="{ on }">
      <span
        id="menu-activator"
        v-on="on"
      >
        <slot name="display">{{ value }}</slot>
      </span>
    </template>

    <v-list>
      <v-list-item
        v-for="(option, i) in options"
        :key="i"
        @click="$emit('change', option)"
      >
        <slot name="option" :option="option">
          <v-list-item-title>{{ option }}</v-list-item-title>
        </slot>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    props: {
      value: String,
      options: Array,
      optionKey: String,
      disabled: Boolean
    }
  }
</script>

<style scoped>
  #menu-activator {
    cursor: pointer;
  }
</style>
