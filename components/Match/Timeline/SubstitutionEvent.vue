<template lang="pug">
  v-timeline-item(
    :color="color"
    :icon="`mdi-${icon}`"
    fill-dot
  )
    h2.headline.font-weight-light.my-0(:class="`${color}--text`")
      | {{ substitution.minute }}"
      span.caption.text-truncate.mx-1(:class="`${captionColor}--text`")
        | {{ substitution.home ? match.home : match.away }}
      template(v-if="!readonly")
        substitution-form(:match="match" :record="substitution")
          template(#default="{ on }")
            tooltip-button(
              label="Edit Substitution"
              icon="mdi-pencil"
              color="orange"
              small
              :on="on"
            )
        |&nbsp;
        record-remove(
          :record="substitution"
          store="substitutions"
          label="Substitution"
        )
    span.font-weight-bold {{ substitution.player_name }}
    |&nbsp;
    | {{ action }}
    |&nbsp;
    span.font-weight-bold {{ substitution.replaced_by }}
</template>

<script>
  import SubstitutionForm from '@/components/Substitution/Form'

  export default {
    name: 'SubstitutionEvent',
    components: {
      SubstitutionForm
    },
    props: {
      match: {
        type: Object,
        required: true
      },
      substitution: {
        type: Object,
        required: true
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      action () {
        return this.substitution.injured
          ? 'has been injured. Replaced by'
          : 'replaced by'
      },
      color () {
        return this.substitution.injury ? 'pink' : 'green'
      },
      captionColor () {
        return this.substitution.home ? 'teal' : 'pink'
      },
      icon () {
        return this.substitution.injury ? 'ambulance' : 'repeat'
      }
    }
  }
</script>
