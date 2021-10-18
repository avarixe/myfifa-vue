<script>
  import {
    ref,
    toRef,
    reactive,
    watchEffect,
    useRouter,
    useStore
  } from '@nuxtjs/composition-api'
  import { format } from 'date-fns'
  import { isRequired } from '@/functions'

  export default {
    name: 'TeamForm',
    props: {
      record: { type: Object, default: null }
    },
    setup (props) {
      const attributes = reactive({
        name: '',
        startedOn: format(new Date(), 'yyyy-MM-dd'),
        currency: '$'
      })

      const dialog = ref(false)
      const record = toRef(props, 'record')
      const title = ref('New Team')
      watchEffect(() => {
        if (dialog.value && record.value) {
          attributes.name = record.value.name
          attributes.startedOn = record.value.startedOn
          attributes.currency = record.value.currency
          title.value = 'Edit Team'
        }
      })

      const store = useStore()
      const router = useRouter()
      const submit = async () => {
        if (record.value) {
          await store.dispatch('teams/update', {
            id: record.value.id,
            attributes
          })
        } else {
          const { id: teamId } = await store.dispatch('teams/create', attributes)
          router.push({
            name: 'teams-teamId',
            params: { teamId }
          })
        }
      }

      return {
        attributes,
        dialog,
        title,
        submit,
        rulesFor: {
          name: [isRequired('Name')],
          currency: [isRequired('Currency')]
        }
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
        <team-combobox
          v-model="attributes.name"
          label="Name"
          prepend-icon="mdi-shield-half-full"
          :rules="rulesFor.name"
        />
      </v-col>
      <v-col cols="12">
        <v-date-field
          v-model="attributes.startedOn"
          label="Start Date"
          prepend-icon="mdi-calendar-today"
          :disabled="!!record"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="attributes.currency"
          label="Currency"
          prepend-icon="mdi-cash"
          :rules="rulesFor.currency"
        />
      </v-col>
    </template>
    <template #additional-actions>
      <team-badge-uploader
        v-if="record"
        :team="record"
        color="info"
      >
        <template #activator="{ on }">
          <v-btn
            color="info"
            text
            v-on="on"
          >
            {{ record.badgePath ? 'Change' : 'Upload' }} Badge
          </v-btn>
        </template>
      </team-badge-uploader>
    </template>
  </dialog-form>
</template>
