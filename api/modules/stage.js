import objectify from '@/plugins/objectify'

export function formatter (stage) {
  return {
    ...stage,
    table_rows: objectify(stage.table_rows),
    fixtures: objectify(stage.fixtures)
  }
}
