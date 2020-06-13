<template>
  <v-timeline-item
    :color="color"
    :icon="`mdi-${icon}`"
    fill-dot
  >
    <h2 :class="`text-h5 font-weight-light my-0 ${color}--text`">
      {{ substitution.minute }}"
      <span :class="`text-caption text-truncate mx-1 ${captionColor}--text`">
        {{ substitution.home ? match.home : match.away }}
      </span>
      <template v-if="!readonly">
        <substitution-form
          :match="match"
          :record="substitution"
        >
          <template #default="{ on }">
            <tooltip-button
              label="Edit Substitution"
              icon="mdi-pencil"
              color="orange"
              small
              :on="on"
            />
          </template>
        </substitution-form>
        <record-remove
          :record="substitution"
          store="substitutions"
          label="Substitution"
        />
      </template>
    </h2>
    <b>{{ substitution.player_name }}</b>
    {{ action }}
    <b>{{ substitution.replaced_by }}</b>
  </v-timeline-item>
</template>

<script>
  import SubstitutionForm from '@/components/Substitution/Form'

  export default {
    name: 'SubstitutionEvent',
    components: {
      SubstitutionForm
    },
    props: {
      match: { type: Object, required: true },
      substitution: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
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
