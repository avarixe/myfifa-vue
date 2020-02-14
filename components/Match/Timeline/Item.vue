<script>
  import BookingEvent from './BookingEvent'
  import GoalEvent from './GoalEvent'
  import PenaltyShootoutEvent from './PenaltyShootoutEvent'
  import SubstitutionEvent from './SubstitutionEvent'

  export default {
    functional: true,
    props: {
      match: {
        type: Object,
        required: true
      },
      event: {
        type: Object,
        required: true
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    render (createElement, { props: { match, event, readonly } }) {
      switch (event.constructor.title) {
        case 'Booking':
          return createElement(BookingEvent, {
            props: { match, booking: event, readonly }
          })
        case 'Goal':
          return createElement(GoalEvent, {
            props: { match, goal: event, readonly }
          })
        case 'Penalty Shootout':
          return createElement(PenaltyShootoutEvent, {
            props: { match, penaltyShootout: event, readonly }
          })
        case 'Substitution':
          return createElement(SubstitutionEvent, {
            props: { match, substitution: event, readonly }
          })
        default:
          throw new Error('Wrong Timeline Event Type!')
      }
    }
  }
</script>
