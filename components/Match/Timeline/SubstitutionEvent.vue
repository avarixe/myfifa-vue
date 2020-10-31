<template>
  <v-timeline-item
    :color="teamColor"
    :icon="`mdi-${icon}`"
    fill-dot
  >
    <template #icon>
      {{ substitution.minute }}'
    </template>
    <h2 class="font-weight-light my-0">
      <span :class="`text-caption text-truncate mx-1 ${teamColor}--text`">
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

    <div>
      <v-icon
        :color="color"
        small
        left
      >
        mdi-{{ icon }}
      </v-icon>
      {{ substitution.player_name }}
    </div>
    <div>
      <v-icon
        color="green"
        small
        left
      >
        mdi-subdirectory-arrow-right
      </v-icon>
      {{ substitution.replaced_by }}
    </div>
  </v-timeline-item>
</template>

<script>
  export default {
    name: 'SubstitutionEvent',
    props: {
      match: { type: Object, required: true },
      substitution: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    computed: {
      color () {
        return this.substitution.injury ? 'pink' : 'orange'
      },
      teamColor () {
        return this.substitution.home ? 'teal' : 'purple'
      },
      icon () {
        return this.substitution.injury ? 'ambulance' : 'subdirectory-arrow-left'
      }
    }
  }
</script>
