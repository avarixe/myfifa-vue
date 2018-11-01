import objectify from '@/plugins/objectify'

export function formatter (player) {
  return {
    ...player,
    player_histories: objectify(player.player_histories)
  }
}
