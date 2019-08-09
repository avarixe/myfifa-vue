<script>
  import GoalForm from '@/components/Goal/Form'
  import BookingForm from '@/components/Booking/Form'
  import SubstitutionForm from '@/components/Substitution/Form'
  import PenaltyShootoutForm from '@/components/PenaltyShootout/Form'

  export default {
    functional: true,
    props: {
      record: {
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
            return GoalForm
          case 'Booking':
            return BookingForm
          case 'Substitution':
            return SubstitutionForm
          case 'Penalty Shootout':
            return PenaltyShootoutForm
          default:
            throw new Error('Invalid Record Type!')
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
