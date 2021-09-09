import { gql } from 'nuxt-graphql-request'

export const contractFragment = gql`
  fragment ContractData on Contract {
    id
    playerId
    signedOn
    wage
    signingBonus
    releaseClause
    performanceBonus
    bonusReq
    bonusReqType
    endedOn
    startedOn
    conclusion
    createdAt
  }
`

export const injuryFragment = gql`
  fragment InjuryData on Injury {
    id
    playerId
    startedOn
    endedOn
    description
    createdAt
  }
`

export const loanFragment = gql`
  fragment LoanData on Loan {
    id
    playerId
    startedOn
    signedOn
    endedOn
    origin
    destination
    wagePercentage
    transferFee
    addonClause
    createdAt
  }
`

export const playerFragment = gql`
  fragment PlayerData on Player {
    id
    teamId
    name
    nationality
    pos
    secPos
    ovr
    value
    status
    youth
    kitNo
    age
  }
`

export const playerHistoryFragment = gql`
  fragment PlayerHistoryData on PlayerHistory {
    id
    playerId
    recordedOn
    ovr
    value
  }
`

export const transferFragment = gql`
  fragment TransferData on Transfer {
    id
    playerId
    signedOn
    movedOn
    origin
    destination
    fee
    tradedPlayer
    addonClause
    createdAt
  }
`
