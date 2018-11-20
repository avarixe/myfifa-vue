<script>
  import GoalContent from './GoalContent'
  import BookingContent from './BookingContent'
  import SubstitutionContent from './SubstitutionContent'
  import PenaltyShootoutContent from './PenaltyShootoutContent'

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

        switch (item.event_type) {
          case 'Goal':
            return GoalContent
          case 'Booking':
            return BookingContent
          case 'Substitution':
            return SubstitutionContent
          case 'PenaltyShootout':
            return PenaltyShootoutContent
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
