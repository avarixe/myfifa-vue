<template>
  <div>
    <span
      v-if="readonly"
      :class="displayClass"
      v-text="humanizedDisplay"
    />

    <v-menu
      v-else
      v-model="menu"
      auto
    >
      <template #activator="{ on: menu }">
        <v-tooltip bottom>
          <template #activator="{ on: tooltip }">
            <span v-on="{ ...menu, ...tooltip }">
              <v-badge color="transparent">
                <template #badge>
                  <v-icon>mdi-circle-edit-outline</v-icon>
                </template>
                <span :class="displayClass">{{ humanizedDisplay }}</span>
              </v-badge>
            </span>
          </template>
          Click to Edit {{ label }}
        </v-tooltip>
      </template>

      <v-list>
        <list-option
          v-for="(item, i) in options"
          :key="i"
          :item="item"
          :option-avatar="optionAvatar"
          :option-text="optionText"
          :selected="value === (optionValue ? item[optionValue] : item)"
          :dense="dense"
          @click="emitChange(item)"
        />
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator'
  import ListOption from './ListOption'

  @Component({
    components: {
      ListOption
    }
  })
  export default class InlineSelect extends Vue {
    @Prop({ type: Object, required: true }) item
    @Prop({ type: String, required: true }) attribute
    @Prop(String) label
    @Prop(Array) options
    @Prop(String) optionAvatar
    @Prop(String) optionText
    @Prop(String) optionValue
    @Prop(Array) rules
    @Prop([String, Number]) display
    @Prop(String) displayClass
    @Prop({ type: Boolean, default: false }) readonly
    @Prop({ type: Boolean, default: false }) dense

    menu = false
    value = null
    original = null
    key = 0

    get humanizedDisplay () {
      const value = this.display || this.value
      return value === null || value === '' ? '-' : value
    }

    @Watch('item', { immediate: true })
    @Watch('attribute')
    reset () {
      this.value = this.item[this.attribute]
      this.original = this.value
    }

    emitChange (item) {
      this.$emit('change', this.optionValue ? item[this.optionValue] : item)
    }
  }
</script>
