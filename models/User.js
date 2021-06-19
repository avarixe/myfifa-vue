import { Model } from '@vuex-orm/core'

export default class User extends Model {
  static entity = 'User'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),

      // Database fields
      full_name: this.string(''),
      username: this.string(''),
      email: this.string(''),
      admin: this.boolean(false),
      dark_mode: this.boolean(false)
    }
  }
}
