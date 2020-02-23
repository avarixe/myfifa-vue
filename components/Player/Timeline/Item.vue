<script>
  import ContractEvent from './ContractEvent'
  import InjuryEvent from './InjuryEvent'
  import LoanEvent from './LoanEvent'
  import TransferEvent from './TransferEvent'

  export default {
    functional: true,
    props: {
      player: { type: Object, required: true },
      event: { type: Object, required: true },
      dense: { type: Boolean, default: false }
    },
    render (createElement, { props: { player, event, dense } }) {
      switch (event.constructor.title) {
        case 'Contract':
          return createElement(ContractEvent, {
            props: { player, contract: event, dense }
          })
        case 'Injury':
          return createElement(InjuryEvent, {
            props: { player, injury: event, dense }
          })
        case 'Loan':
          return createElement(LoanEvent, {
            props: { player, loan: event, dense }
          })
        case 'Transfer':
          return createElement(TransferEvent, {
            props: { player, transfer: event, dense }
          })
        default:
          throw new Error('Wrong Timeline Event Type!')
      }
    }
  }
</script>
