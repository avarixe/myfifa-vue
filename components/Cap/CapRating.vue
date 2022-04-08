<template>
  <v-menu open-on-hover>
    <template #activator="{ on }">
      <v-btn
        class="text-caption"
        x-small
        :outlined="!readonly"
        text
        :color="color[rating] || 'grey'"
        v-on="readonly ? null : on"
      >
        <v-icon x-small>mdi-star-four-points</v-icon>
        {{ cap.rating || 'N/A' }}
      </v-btn>
    </template>
    <v-card>
      <v-rating
        v-model="rating"
        hover
        :background-color="color[rating] || 'grey'"
        :color="color[rating] || 'grey'"
        @input="updateRating"
      >
        <template #item="{ index, click }">
          <v-icon
            :color="color[hoverRating] || 'grey'"
            @mouseenter.prevent="hoverRating = index + 1"
            @click="click"
          >
            mdi-star-four-points{{ hoverRating > index ? '' : '-outline' }}
          </v-icon>
        </template>
      </v-rating>
    </v-card>
  </v-menu>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'CapRating',
    props: {
      cap: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    data: () => ({
      rating: null,
      hoverRating: null,
      color: {
        1: 'red',
        2: 'orange',
        3: 'yellow',
        4: 'light-green',
        5: 'green'
      }
    }),
    watch: {
      'cap.rating': {
        immediate: true,
        handler (rating) {
          this.rating = rating
          this.hoverRating = rating
        }
      }
    },
    methods: {
      ...mapActions('caps', {
        updateCap: 'update'
      }),
      async updateRating () {
        try {
          await this.updateCap({
            id: this.cap.id,
            attributes: {
              rating: this.rating
            }
          })
        } catch (e) {
          console.error(e)
        }
      }
    }
  }
</script>
