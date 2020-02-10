export function GoalFields (context) {
  let fields = [
    {
      type: 'radio',
      attribute: 'home',
      items: [
        { label: context.match.home, value: true, color: 'teal' },
        { label: context.match.away, value: false, color: 'pink' }
      ],
      hideDetails: true,
      onUpdate: context.clearNames
    },
    { slot: 'minute' }
  ]

  if (context.teamGoal) {
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
      disabled: context.goal.penalty || context.goal.own_goal,
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
      disabled: context.goal.own_goal,
      hideDetails: true
    },
    {
      type: 'checkbox',
      attribute: 'own_goal',
      label: 'Own Goal',
      disabled: context.goal.penalty,
      hideDetails: true
    }
  ]
}
