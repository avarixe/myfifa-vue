import Vue from 'vue'
import { requiredRule, rangeRule, formatRule } from '@/helpers/utilities'

Vue.directive('rules', {
  bind (el, binding, vnode) {
    if (typeof binding.value !== 'object') {
      binding.value = {}
      console.debug('`v-rules` binding value defaulted to `{}`.')
    }

    if (binding.value.disabled) {
      console.debug('`v-rules` disabled by binding value')
    } else {
      let rules = []

      for (var rule in binding.modifiers) {
        // default label to field label
        if (!('label' in binding.value)) {
          binding.value.label = vnode.componentInstance.$props.label
        }

        switch (rule) {
          case 'required':
            rules.push(requiredRule(binding.value))
            break
          case 'range':
            rules.push(rangeRule(binding.value))
            break
          case 'format':
            rules.push(formatRule(binding.value))
            break
        }
      }

      Vue.set(vnode.componentInstance.$props, 'rules', rules)
    }
  }
})
