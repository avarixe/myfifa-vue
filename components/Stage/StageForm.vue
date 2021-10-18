<script>
  import { ref, reactive, computed, watch, useStore } from '@nuxtjs/composition-api'
  import { isRequired, isNumber } from '@/functions'

  export default {
    name: 'StageForm',
    props: {
      competition: { type: Object, required: true }
    },
    setup (props) {
      const attributes = reactive({
        name: '',
        numTeams: null,
        numFixtures: null,
        table: false
      })

      const dialog = ref(false)
      watch(dialog, open => {
        if (open) {
          attributes.table = false
        }
      })

      const table = computed(() => attributes.table)
      watch(table, () => {
        if (table.value) {
          attributes.numFixtures = null
        }
      })

      const store = useStore()
      const submit = async () => {
        await store.dispatch('stages/create', {
          competitionId: props.competition.id,
          attributes
        })
      }

      return {
        attributes,
        dialog,
        submit,
        rulesFor: {
          name: [isRequired('Name')],
          numTeams: [
            isRequired('Number of Teams'),
            isNumber('Number of Teams')
          ],
          numFixtures: [
            isRequired('Number of Fixtures'),
            isNumber('Number of Fixtures')
          ]
        }
      }
    }
  }
</script>

<template>
  <dialog-form
    v-model="dialog"
    title="New Stage"
    :submit="submit"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
      >
        <v-btn
          class="my-1"
          dark
          color="teal"
          v-on="on"
        >
          Add Stage
        </v-btn>
      </slot>
    </template>
    <template #form>
      <v-col cols="12">
        <v-text-field
          v-model="attributes.name"
          label="Name"
          prepend-icon="mdi-table"
          :rules="rulesFor.name"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-radio-group
          v-model="attributes.table"
          row
          hide-details
        >
          <v-radio
            label="Table"
            :value="true"
          />
          <v-radio
            label="Elimination Round"
            :value="false"
          />
        </v-radio-group>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="attributes.numTeams"
          label="Number of Teams"
          prepend-icon="mdi-account-group"
          :rules="rulesFor.numTeams"
          inputmode="numeric"
        />
      </v-col>
      <v-scroll-y-transition mode="out-in">
        <v-col
          v-if="!attributes.table"
          cols="12"
        >
          <v-text-field
            v-model.number="attributes.numFixtures"
            label="Number of Fixtures"
            prepend-icon="mdi-sword-cross"
            :rules="rulesFor.numFixtures"
            inputmode="numeric"
          />
        </v-col>
      </v-scroll-y-transition>
    </template>
  </dialog-form>
</template>
