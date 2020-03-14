<template>
  <v-timeline-item
    icon="mdi-file-document"
    color="blue"
    fill-dot
    right
  >
    <template #opposite>
      <span class="headline font-weight-bold blue--text">Contract</span>
      <h4 class="title font-weight-light mb-3 blue--text">
        {{ contract.started_on | formatDate }} - {{ contract.ended_on | formatDate }}
        <span
          v-if="contract.conclusion"
          class="pl-1"
        >
          ({{ contract.conclusion }})
        </span>
      </h4>
    </template>
    <v-card
      dense
      flat
    >
      <v-card-title
        v-if="dense"
        class="py-0"
      >
        <div class="blue--text">
          <span class="title font-weight-bold">Contract</span>
          <h4 class="body-2 font-weight-light mb-3">
            {{ contract.started_on | formatDate }} - {{ contract.ended_on | formatDate }}
            <span
              v-if="contract.conclusion"
              class="pl-1"
            >
              ({{ contract.conclusion }})
            </span>
          </h4>
        </div>
      </v-card-title>
      <v-card-text class="py-0">
        <table>
          <tbody>
            <tr>
              <td class="font-weight-bold">Wage</td>
              <td class="pl-1">
                {{ contract.wage | formatMoney(team.currency) }}
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">Signing Bonus</td>
              <td class="pl-1">
                {{ contract.signing_bonus | formatMoney(team.currency) }}
              </td>
            </tr>
            <tr v-if="contract.performance_bonus">
              <td class="font-weight-bold">Performance Bonus</td>
              <td class="pl-1">
                {{ contract.performance_bonus | formatMoney(team.currency) }}
                if {{ contract.bonus_req }} {{ contract.bonus_req_type }}
              </td>
            </tr>
            <tr v-if="contract.release_clause">
              <td class="font-weight-bold">Release Clause</td>
              <td class="pl-1">
                {{ contract.release_clause | formatMoney(team.currency) }}
              </td>
            </tr>
          </tbody>
        </table>
      </v-card-text>
      <v-card-actions>
        <contract-form
          :player="player"
          :record="contract"
        >
          <template #default="{ on }">
            <v-btn
              text
              small
              color="orange"
              v-on="on"
            >
              Edit
            </v-btn>
          </template>
        </contract-form>
      </v-card-actions>
    </v-card>
  </v-timeline-item>
</template>

<script>
  import { TeamAccessible } from '@/mixins'
  import ContractForm from '@/components/Contract/Form'

  export default {
    name: 'ContractEvent',
    components: {
      ContractForm
    },
    mixins: [
      TeamAccessible
    ],
    props: {
      player: { type: Object, required: true },
      contract: { type: Object, required: true },
      dense: { type: Boolean, default: false }
    }
  }
</script>
