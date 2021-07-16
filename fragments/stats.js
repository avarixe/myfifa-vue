import { gql } from 'nuxt-graphql-request'

export const competitionStatsFragment = gql`
  fragment CompetitionStatsData on CompetitionStats {
    season
    competition
    wins
    draws
    losses
    goalsFor
    goalsAgainst
  }
`

export const playerStatsFragment = gql`
  fragment PlayerStatsData on PlayerStats {
    playerId
    season
    competition
    numMatches
    numMinutes
    numGoals
    numAssists
    numCleanSheets
  }
`

export const playerHistoryStatsFragment = gql`
  fragment PlayerHistoryStatsData on PlayerHistoryStats {
    playerId
    ovr
    value
  }
`
