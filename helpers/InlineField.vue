<template>
  <div :key="key">
    <template v-if="readonly">
      <span :class="displayClass">{{ humanizedDisplay }}</span>
    </template>
    <template v-else>
      <v-edit-dialog
        @open="open"
        @close="close"
      >
        <v-tooltip bottom>
          <template #activator="{ on }">
            <span v-on="on">
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

        <template #input>
          <v-combobox
            v-if="inputType === 'combobox'"
            v-model="value"
            :items="options"
            :item-avatar="optionAvatar"
            :item-text="optionText"
            :item-value="optionValue"
            :rules="rules"
            :label="label"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
            autofocus
          >
            <template #item="{ item }">
              <slot
                name="option"
                :item="item"
              >
                <list-option
                  :item="item"
                  :option-avatar="optionAvatar"
                  :option-text="optionText"
                />
              </slot>
            </template>
          </v-combobox>
          <v-select
            v-else-if="inputType === 'select'"
            v-model="value"
            :items="options"
            :item-avatar="optionAvatar"
            :item-text="optionText"
            :item-value="optionValue"
            :rules="rules"
            :label="label"
            menu-props="auto"
            @change="close"
          >
            <template #item="{ item }">
              <slot
                name="option"
                :item="item"
              >
                <list-option
                  :item="item"
                  :option-avatar="optionAvatar"
                  :option-text="optionText"
                />
              </slot>
            </template>
          </v-select>
          <v-money-field
            v-else-if="inputType === 'money'"
            v-model="value"
            :label="label"
            :prefix="team.currency"
            :required="required"
            autofocus
          />
          <v-text-field
            v-else
            v-model="value"
            :label="label"
            :type="inputType"
            :rules="rules"
            autofocus
          />
        </template>
      </v-edit-dialog>
    </template>
  </div>
</template>

<script>
  import { mixins, Component, Prop } from 'nuxt-property-decorator'
  import { Watch } from 'vue-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import ListOption from './ListOption'
  import VMoneyField from './VMoneyField'

  @Component({
    components: {
      ListOption,
      VMoneyField
    }
  })
  export default class InlineField extends mixins(TeamAccessible) {
    @Prop({ type: Object, required: true }) item
    @Prop({ type: String, required: true }) attribute
    @Prop(String) label
    @Prop(Array) options
    @Prop(String) optionAvatar
    @Prop(String) optionText
    @Prop(String) optionValue
    @Prop(Array) rules
    @Prop(String) inputType
    @Prop([String, Number]) display
    @Prop(String) displayClass
    @Prop({ type: Boolean, default: false }) readonly
    @Prop({ type: Boolean, default: false }) required

    value = null
    original = null
    key = 0

    get humanizedDisplay () {
      const value = this.display || this.value
      return value === null || value === '' ? '-' : value
    }

    get isDirty () {
      return this.value !== this.original
    }

    @Watch('item', { immediate: true })
    @Watch('attribute')
    reset () {
      this.value = this.item[this.attribute]
      this.original = this.value
    }

    open () {
    }

    close () {
      if (this.isDirty) {
        this.$emit('close', this.value)
        this.key++
      }
    }
  }
</script>
