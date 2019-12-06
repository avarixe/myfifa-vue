import Vue from 'vue'

function required (options) {
  return v => !!v || `${options.label} is required`
}

function range (options) {
  return v => (
    (!isNaN(v) && options.min <= parseFloat(v) && parseFloat(v) <= options.max) ||
    `${options.label} must be between ${options.min} and ${options.max}`
  )
}

function format (options) {
  const error = `${options.label} must be valid`
  switch (options.type) {
    case 'email':
      return v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || error
    case 'date':
      return v => /^\d{4}-\d{2}-\d{2}$/.test(v) || error
  }
}

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
            rules.push(required(binding.value))
            break
          case 'range':
            rules.push(range(binding.value))
            break
          case 'format':
            rules.push(format(binding.value))
            break
        }
      }

      Vue.set(vnode.componentInstance.$props, 'rules', rules)
    }
  }
})
