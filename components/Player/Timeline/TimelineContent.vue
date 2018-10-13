<script>
  import ContractContent from '@/components/Player/Timeline/ContractContent'
  import InjuryContent from '@/components/Player/Timeline/InjuryContent'
  import LoanContent from '@/components/Player/Timeline/LoanContent'
  import TransferContent from '@/components/Player/Timeline/TransferContent'

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
        var item = context.props.item

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