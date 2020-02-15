export const PenaltyShootoutFields = () => [
  {
    cols: 6,
    type: 'string',
    attribute: 'home_score',
    label: 'Home Score',
    prependIcon: 'mdi-soccer',
    required: true,
    inputmode: 'numeric'
  },
  {
    cols: 6,
    type: 'string',
    attribute: 'away_score',
    label: 'Away Score',
    prependIcon: 'mdi-soccer',
    required: true,
    inputmode: 'numeric'
  }
]
