<script>
  import ContractContent from './ContractContent'
  import InjuryContent from './InjuryContent'
  import LoanContent from './LoanContent'
  import TransferContent from './TransferContent'

  export default {
    functional: true,
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    render (createElement, context) {
      function contentComponent () {
        const item = context.props.item

        switch (item.type) {
          case 'Contract':
            return ContractContent
          case 'Injury':
            return InjuryContent
          case 'Loan':
            return LoanContent
          case 'Transfer':
            return TransferContent
          default:
            throw new Error('Wrong Timeline Item Type!')
        }
      }

      return createElement(
        contentComponent(),
        {
          ...context.data,
          props: context.props
        },
        context.children
      )
    }
  }
</script>
