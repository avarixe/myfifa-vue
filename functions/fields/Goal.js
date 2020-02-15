export function GoalFields ({ goal, match, team }) {
  function clearNames () {
    goal.player_id = null
    goal.player_name = null
    goal.assist_id = null
    goal.assisted_by = null
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

  if (!goal.home ^ match.home === team.title) {
    fields.push({ slot: 'player_id' })
    fields.push({ slot: 'assist_id' })
  } else {
    fields.push({
      type: 'string',
      attribute: 'player_name',
      label: 'Goal Scorer',
      prependIcon: 'mdi-account',
      required: true,
      spellcheck: 'false',
      autocapitalize: 'words',
      autocomplete: 'off',
      autocorrect: 'off'
    })
    fields.push({
      type: 'string',
      attribute: 'assisted_by',
      label: 'Assisted By',
      prependIcon: 'mdi-human-greeting',
      hideDetails: true,
      disabled: goal.penalty || goal.own_goal,
      spellcheck: 'false',
      autocapitalize: 'words',
      autocomplete: 'off',
      autocorrect: 'off'
    })
  }

  return [
    ...fields,
    {
      type: 'checkbox',
      attribute: 'penalty',
      label: 'Penalty',
      disabled: goal.own_goal,
      hideDetails: true
    },
    {
      type: 'checkbox',
      attribute: 'own_goal',
      label: 'Own Goal',
      disabled: goal.penalty,
      hideDetails: true
    }
  ]
}
