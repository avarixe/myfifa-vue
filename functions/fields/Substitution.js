export const SubstitutionFields = context => [
  { slot: 'minute' },
  { slot: 'player_id' },
  { slot: 'replacement_id' },
  {
    type: 'checkbox',
    object: context.substitution,
    attribute: 'injury',
    label: 'Injury',
    hideDetails: true
  }
]
