<script>
  import {
    ref,
    reactive,
    computed,
    onMounted,
    onBeforeUnmount,
    useContext,
    useStore
  } from '@nuxtjs/composition-api'
  import mapKeys from 'lodash.mapkeys'
  import camelCase from 'lodash.camelcase'
  import { useTeam } from '@/composables'

  export default {
    name: 'TeamChannel',
    setup () {
      const socket = ref(null)
      const timeout = ref(null)
      const insertBuffer = reactive({})
      const deleteBuffer = reactive({})

      const store = useStore()
      const updateStore = () => {
        Object.keys(deleteBuffer).forEach(async type => {
          const ids = deleteBuffer[type].map(data => data.id)
          await store.$db().model(type).delete(record => ids.indexOf(record.id) > -1)
          delete deleteBuffer[type]
        })

        Object.keys(insertBuffer).forEach(async type => {
          const data = insertBuffer[type].map(
            record => mapKeys(record, (_v, k) => camelCase(k))
          )
          await store.$db().model(type).insertOrUpdate({ data })
          delete insertBuffer[type]
        })
      }

      const addToBuffer = ({ type, data, destroyed }) => {
        let buffer = destroyed ? deleteBuffer : insertBuffer

        if (type in buffer) {
          buffer[type].push(data)
        } else {
          buffer[type] = [data]
        }

        clearTimeout(timeout.value)
        timeout.value = setTimeout(updateStore, 300)
      }

      const token = computed(() => store.state.auth.token)
      const { $config } = useContext()
      const { teamId } = useTeam()
      onMounted(() => {
        if (token.value) {
          socket.value = new WebSocket(
            `${$config.cableURL}?access_token=${token.value}`
          )

          socket.value.onmessage = event => {
            const { message } = JSON.parse(event.data)
            const { type, data, destroyed } = message || {}
            if (type) {
              // console.log(type, data, destroyed)
              addToBuffer({ type, data, destroyed })
            }
          }

          socket.value.onopen = () => {
            socket.value.send(JSON.stringify({
              command: 'subscribe',
              identifier: JSON.stringify({
                channel: 'TeamChannel',
                id: teamId.value
              })
            }))
          }
        }

      })

      onBeforeUnmount(() => {
        socket.value.close()
      })
    }
  }
</script>

<template>
  <div />
</template>
