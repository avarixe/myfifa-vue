<template>
  <v-dialog
    v-model="dialog"
    scrollable
    max-width="500px"
  >
    <template #activator="{ on }">
      <slot :on="on" />
    </template>
    <v-card>
      <v-card-title>
        <v-toolbar-title>
          <v-icon left>mdi-cog</v-icon>
          App Settings
        </v-toolbar-title>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <v-radio-group
              row
              hide-details
              :value="mode"
              @change="setMode"
            >
              <v-radio
                label="Light"
                value="light"
              />
              <v-radio
                label="Dark"
                value="dark"
              />
            </v-radio-group>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
  import { DialogFormable } from '@/mixins'

  export default {
    name: 'UserForm',
    mixins: [
      DialogFormable
    ],
    data: () => ({
      modes: [
        { text: 'Light', value: 'light' },
        { text: 'Dark', value: 'dark' }
      ]
    }),
    computed: mapState('app', [
      'mode'
    ]),
    methods: mapMutations('app', {
      setMode: 'SET_MODE'
    })
  }
</script>
