export function teamOptions (competition) {
  const stages = Object.values(competition.stages)
  let array = stages.reduce((arr, stage) => {
    const tableRows = Object.values(stage.table_rows)
    const fixtures = Object.values(stage.fixtures)
    return [
      ...arr,
      ...tableRows.map(row => row.name),
      ...fixtures.reduce((names, fixture) => {
        return [ ...names, fixture.home_team, fixture.away_team ]
      }, [])
    ]
  }, [])
  return [ ...new Set(array.filter(team => team != null)) ]
}
