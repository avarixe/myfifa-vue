export function BookingFields ({ booking, match, team }) {
  function clearNames () {
    booking.player_id = null
    booking.player_name = ''
  }

  let fields = [
    {
      type: 'radio',
      attribute: 'home',
      items: [
        { label: match.home, value: true, color: 'teal' },
        { label: match.away, value: false, color: 'pink' }
      ],
      hideDetails: true,
      onUpdate: clearNames
    },
    { slot: 'minute' }
  ]

  if (!booking.home ^ match.home === team.title) {
    fields.push({ slot: 'player_id' })
  } else {
    fields.push({
      type: 'string',
      attribute: 'player_name',
      label: 'Player',
      prependIcon: 'mdi-account',
      required: true,
      spellcheck: 'false',
      autocapitalize: 'words',
      autocomplete: 'off',
      autocorrect: 'off'
    })
  }

  return [
    ...fields,
    {
      type: 'radio',
      attribute: 'red_card',
      items: [
        { label: 'Yellow Card', value: false, color: 'orange darken-2' },
        { label: 'Red Card', value: true, color: 'red darken-2' }
      ],
      hideDetails: true
    }
  ]
}
