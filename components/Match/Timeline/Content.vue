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
      },
      type: {
        type: String,
        required: true
      }
    },
    render (createElement, context) {
      function contentComponent () {
        switch (context.props.type) {
          case 'Goal':
            return GoalContent
          case 'Booking':
            return BookingContent
          case 'Substitution':
            return SubstitutionContent
          case 'Penalty Shootout':
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
