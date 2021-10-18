<script>
  import {
    ref,
    reactive,
    toRef,
    computed,
    watchEffect,
    useRouter,
    useStore
  } from '@nuxtjs/composition-api'
  import { useTeam } from '@/composables'
  import { positions } from '@/constants'
  import { isRequired, inRange, isNumber } from '@/functions'

  export default {
    name: 'PlayerForm',
    props: {
      record: { type: Object, default: null }
    },
    setup (props) {
      const attributes = reactive({
        name: '',
        pos: '',
        nationality: null,
        secPos: [],
        ovr: null,
        value: '',
        kitNo: null,
        age: null,
        youth: false
      })

      const dialog = ref(false)
      const title = ref('New Player')
      const record = toRef(props, 'record')
      watchEffect(() => {
        if (dialog.value) {
          if (record.value) {
            attributes.name = record.value.name
            attributes.pos = record.value.pos
            attributes.age = record.value.age
            attributes.nationality = record.value.nationality
            attributes.ovr = record.value.ovr
            attributes.value = record.value.value
            attributes.kitNo = record.value.kitNo
            attributes.youth = record.value.youth
            attributes.secPos = [...record.value.secPos]
            title.value = 'Edit Player'
          } else {
            attributes.secPos = []
            attributes.youth = false
          }
        }
      })

      const store = useStore()
      const router = useRouter()
      const { team } = useTeam()
      const submit = async () => {
        if (record.value) {
          await store.dispatch('players/update', {
            id: record.value.id,
            attributes
          })
        } else {
          const { id: playerId } = await store.dispatch('players/create', {
            teamId: team.value.id,
            attributes
          })
          router.push({
            name: 'teams-teamId-players-playerId',
            params: {
              teamId: team.value.id,
              playerId
            }
          })
        }
      }

      return {
        attributes,
        dialog,
        title,
        submit,
        team,
        rulesFor: {
          name: [isRequired('Name')],
          pos: [isRequired('Position')],
          age: [
            isRequired('Age'),
            isNumber('Age')
          ],
          ovr: [
            isRequired('OVR'),
            isNumber('OVR'),
            inRange('OVR', [40, 100])
          ],
          kitNo: [
            isNumber('Kit Number'),
            inRange('Kit Number', [1, 99])
          ]
        },
        positions
      }
    }
  }
</script>

<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
      />
    </template>
    <template #form>
      <v-col cols="12">
        <v-text-field
          v-model="attributes.name"
          label="Name"
          prepend-icon="mdi-account"
          :rules="rulesFor.name"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <nationality-field v-model="attributes.nationality" />
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="attributes.pos"
          label="Position"
          prepend-icon="mdi-run"
          :items="positions"
          :rules="rulesFor.pos"
        />
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="attributes.secPos"
          label="Secondary Position(s)"
          prepend-icon="mdi-walk"
          :items="positions"
          multiple
          chips
          deletable-chips
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="attributes.age"
          label="Age"
          prepend-icon="mdi-calendar"
          :rules="rulesFor.age"
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="attributes.ovr"
          label="OVR"
          prepend-icon="mdi-trending-up"
          :rules="rulesFor.ovr"
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="12">
        <v-money-field
          v-model.number="attributes.value"
          label="Value"
          :prefix="team.currency"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="attributes.kitNo"
          label="Kit Number"
          prepend-icon="mdi-tshirt-crew"
          :rules="rulesFor.kitNo"
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="attributes.youth"
          label="Youth Player"
          :disabled="record !== null"
          hide-details
        />
      </v-col>
    </template>
  </dialog-form>
</template>
