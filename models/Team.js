import { Model } from '@vuex-orm/core'

export default class Team extends Model {
  static entity = 'teams'

  static fields () {
    return {
      id: this.attr(null),
      title: this.attr(''),
      start_date: this.attr(null),
      current_date: this.attr(null),
      active: this.attr(true),
      currency: this.attr('$')
    }
  }
}
