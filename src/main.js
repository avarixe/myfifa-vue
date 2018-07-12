// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  VCarousel,
  VDialog,
  VCard,
  VTextField,
  VAlert,
  VForm,
  VRadioGroup,
  VSwitch,
  VTabs,
  VTooltip,
  VMenu,
  VDatePicker,
  VSpeedDial,
  VSnackbar,
  VDataTable,
  VPagination,
  VBreadcrumbs,
  VSelect,
  VSlider,
  VCheckbox,
  VDivider,
  VAutocomplete,
  VCombobox,
  VExpansionPanel,
  VSubheader,
  transitions
} from 'vuetify'
import { format, parse } from 'date-fns'
import validate from './lib/validators'
import '../node_modules/vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VCarousel,
    VDialog,
    VCard,
    VTextField,
    VAlert,
    VForm,
    VRadioGroup,
    VSwitch,
    VTabs,
    VTooltip,
    VMenu,
    VDatePicker,
    VSpeedDial,
    VSnackbar,
    VDataTable,
    VPagination,
    VBreadcrumbs,
    VSelect,
    VSlider,
    VCheckbox,
    VDivider,
    VAutocomplete,
    VCombobox,
    VExpansionPanel,
    VSubheader,
    transitions
  }
})

Vue.config.productionTip = false
Vue.prototype.$validate = validate
Vue.prototype.$parse = parse
Vue.prototype.$format = (date, dateFormat) => format(date, dateFormat || 'YYYY-MM-DD')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
