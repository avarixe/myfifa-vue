import { Model } from '@vuex-orm/core'
import orderBy from 'lodash.orderby'
import PlayerHistory from './PlayerHistory'
import Injury from './Injury'
import Loan from './Loan'
import Contract from './Contract'
import Transfer from './Transfer'
import Cap from './Cap'
import Match from './Match'
import Goal from './Goal'
import Booking from './Booking'
import Team from './Team'

class Player extends Model {
  static get entity () {
    return 'players'
  }

  static get title () {
    return 'Player'
  }

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      team_id: this.number(0),

      // Database fields
      name: this.string(''),
      nationality: this.string('').nullable(),
      pos: this.string(''),
      sec_pos: this.attr([]),
      ovr: this.number(60),
      value: this.number(null).nullable(),
      birth_year: this.number(null).nullable(),
      status: this.string(null).nullable(),
      youth: this.boolean(false),
      kit_no: this.number(null).nullable(),

      // Calculated fields
      age: this.number(16),
      pos_idx: this.number(0),

      // Associations
      team: this.belongsTo(Team, 'team_id'),
      histories: this.hasMany(PlayerHistory, 'player_id'),
      injuries: this.hasMany(Injury, 'player_id'),
      loans: this.hasMany(Loan, 'player_id'),
      contracts: this.hasMany(Contract, 'player_id'),
      transfers: this.hasMany(Transfer, 'player_id'),
      caps: this.hasMany(Cap, 'player_id'),
      matches: this.belongsToMany(Match, Cap, 'player_id', 'match_id'),
      goals: this.hasMany(Goal, 'player_id'),
      assists: this.hasMany(Goal, 'assist_id'),
      bookings: this.hasMany(Booking, 'player_id')
    }
  }

  get link () {
    return {
      name: 'teams-teamId-players-playerId',
      params: {
        teamId: this.team_id,
        playerId: this.id
      }
    }
  }

  get isActive () {
    return this.status && this.status.length > 0
  }

  get statusColor () {
    switch (this.status) {
      case 'Active':
        return 'light-green'
      case 'Loaned':
        return 'indigo'
      case 'Injured':
        return 'pink'
      case 'Pending':
        return 'deep-orange'
      default:
        return 'black'
    }
  }

  get statusIcon () {
    switch (this.status) {
      case 'Active':
        return 'account-check'
      case 'Loaned':
        return 'transit-transfer'
      case 'Injured':
        return 'hospital'
      case 'Pending':
        return 'lock-clock'
      default:
        return 'minus'
    }
  }

  get flag () {
    return nationalities[this.nationality]
  }

  contract () {
    const contract = Contract
      .query()
      .where('player_id', this.id)
      .where('started_on', date => date <= this.team.currently_on)
      .where('ended_on', date => this.team.currently_on < date)
      .last()
    return contract || {}
  }

  expiresOn () {
    return this.contract().ended_on
  }

  recordAt (date) {
    return PlayerHistory
      .query()
      .where('player_id', this.id)
      .where('recorded_on', recordedOn => recordedOn <= date)
      .last()
  }

  ovrAt (date) {
    return this.recordAt(date).ovr
  }

  valueAt (date) {
    return this.recordAt(date).value
  }
}

export function contractedPlayers (teamId) {
  return orderBy(
    Player
      .query()
      .where('team_id', teamId)
      .where('status', status => status)
      .get(),
    ['pos_idx', 'ovr'],
    ['asc', 'desc']
  )
}

export function activePlayers (teamId) {
  return contractedPlayers(teamId)
    .filter(player => player.status === 'Active')
}

export default Player

export const positions = [
  'GK',
  'RB',
  'RWB',
  'CB',
  'LB',
  'LWB',
  'RM',
  'CDM',
  'CM',
  'CAM',
  'LM',
  'RW',
  'CF',
  'ST',
  'LW'
]

export const nationalities = {
  // Africa
  'Algeria': 'dz',
  'Angola': 'ao',
  'Benin': 'bj',
  'Botswana': 'bw',
  'Burkina Faso': 'bf',
  'Burundi': 'bi',
  'Cameroon': 'cm',
  'Cape Verde': 'cv',
  'Central African Republic': 'cf',
  'Chad': 'td',
  'Comoros': 'km',
  'Congo': 'cg',
  'Djibouti': 'dj',
  'DR Congo': 'cd',
  'Egypt': 'eg',
  'Equatorial Guinea': 'gq',
  'Eritrea': 'er',
  'Eswatini': 'sz',
  'Ethiopia': 'et',
  'Gabon': 'ga',
  'Gambia': 'gm',
  'Ghana': 'gh',
  'Guinea': 'gn',
  'Guinea Bissau': 'gw',
  'Ivory Coast': 'ci',
  'Kenya': 'ke',
  'Lesotho': 'ls',
  'Liberia': 'lr',
  'Libya': 'ly',
  'Madagascar': 'mg',
  'Malawi': 'mw',
  'Mali': 'ml',
  'Mauritania': 'mr',
  'Mauritius': 'mu',
  'Morocco': 'ma',
  'Mozambique': 'mz',
  'Namibia': 'na',
  'Niger': 'ne',
  'Nigeria': 'ng',
  'Rwanda': 'rw',
  'Senegal': 'sn',
  'Seychelles': 'sc',
  'Sierra Leone': 'sl',
  'Somalia': 'so',
  'South Africa': 'za',
  'South Sudan': 'ss',
  'Sudan': 'sd',
  'São Tomé and Príncipe': 'st',
  'Tanzania': 'tz',
  'Togo': 'tg',
  'Tunisia': 'tn',
  'Uganda': 'ug',
  'Zambia': 'zm',
  'Zimbabwe': 'zw',

  // Asia
  'Afghanistan': 'af',
  'Armenia': 'am',
  'Azerbaijan': 'az',
  'Bahrain': 'bh',
  'Bangladesh': 'bd',
  'Bhutan': 'bt',
  'Brunei Darussalem': 'bn',
  'Cambodia': 'kh',
  'China PR': 'cn',
  'Chinese Taipei': 'tw',
  'Georgia': 'ge',
  'Hong Kong': 'hk',
  'India': 'in',
  'Indonesia': 'id',
  'Iran': 'ir',
  'Iraq': 'iq',
  'Israel': 'il',
  'Japan': 'jp',
  'Jordan': 'jo',
  'Kazakhstan': 'kz',
  'Korea DPR': 'kp',
  'Korea Republic': 'kr',
  'Kuwait': 'kw',
  'Kyrgyzstan': 'kg',
  'Laos': 'la',
  'Lebanon': 'lb',
  'Macau': 'mo',
  'Malaysia': 'my',
  'Maldives': 'mv',
  'Mongolia': 'mn',
  'Myanmar': 'mm',
  'Nepal': 'np',
  'Oman': 'om',
  'Pakistan': 'pk',
  'Palestine': 'ps',
  'Philippines': 'ph',
  'Qatar': 'qa',
  'Saudi Arabia': 'sa',
  'Singapore': 'sg',
  'Sri Lanka': 'lk',
  'Syria': 'sy',
  'Tajikistan': 'tj',
  'Thailand': 'th',
  'Timor-Leste': 'tl',
  'Turkey': 'tr',
  'Turkmenistan': 'tm',
  'United Arab Emirates': 'ae',
  'Uzbekistan': 'uz',
  'Vietnam': 'vn',
  'Yemen': 'ye',

  // Europe
  'Albania': 'al',
  'Andorra': 'ad',
  'Austria': 'at',
  'Belarus': 'by',
  'Belgium': 'be',
  'Bosnia & Herzegovina': 'ba',
  'Bulgaria': 'bg',
  'Croatia': 'hr',
  'Cyprus': 'cy',
  'England': 'gb-eng',
  'Estonia': 'ee',
  'Faroe Islands': 'fo',
  'Finland': 'fi',
  'France': 'fr',
  'Germany': 'de',
  'Gibraltar': 'gi',
  'Greece': 'gr',
  'Hungary': 'hu',
  'Iceland': 'is',
  'Italy': 'it',
  'Kosovo': 'xk',
  'Latvia': 'lv',
  'Liechtenstein': 'li',
  'Lithuania': 'lt',
  'Luxembourg': 'lu',
  'Malta': 'mt',
  'Moldova': 'md',
  'Montenegro': 'me',
  'Netherlands': 'nl',
  'North Macedonia': 'mk',
  'Northern Ireland': 'gb-nir',
  'Norway': 'no',
  'Poland': 'pl',
  'Portugal': 'pt',
  'Republic of Ireland': 'ie',
  'Romania': 'ro',
  'Russia': 'ru',
  'San Marino': 'sm',
  'Scotland': 'gb-sct',
  'Serbia': 'rs',
  'Slovakia': 'sk',
  'Slovenia': 'si',
  'Spain': 'es',
  'Sweden': 'se',
  'Switzerland': 'ch',
  'Ukraine': 'ua',
  'Wales': 'gb-wls',

  // North America
  'Anguilla': 'ai',
  'Antigua & Barbuda': 'ag',
  'Bahamas': 'bs',
  'Barbados': 'bb',
  'Belize': 'bz',
  'Bermuda': 'bm',
  'British Virgin Isles': 'vg',
  'Canada': 'ca',
  'Cayman Islands': 'ky',
  'Costa Rica': 'cr',
  'Cuba': 'cu',
  'Czech Republic': 'cz',
  'Denmark': 'dk',
  'Dominica': 'dm',
  'Dominican Republic': 'do',
  'El Salvador': 'sv',
  'Greenland': 'gl',
  'Grenada': 'gd',
  'Guatemala': 'gt',
  'Haiti': 'ht',
  'Honduras': 'hn',
  'Jamaica': 'jm',
  'Mexico': 'mx',
  'Montserrat': 'ms',
  'Nicaragua': 'ni',
  'Panama': 'pa',
  'Puerto Rico': 'pr',
  'St Kitts Nevis': 'kn-sk',
  'St Lucia': 'lc',
  'St Vincent Grenadine': 'vc',
  'Turks & Caicos': 'tc',
  'United States': 'us',
  'US Virgin Islands': 'vi',

  // South America
  'Argentina': 'ar',
  'Aruba': 'aw',
  'Bolivia': 'bo',
  'Brazil': 'br',
  'Chile': 'cl',
  'Colombia': 'co',
  'Curaçao': 'cw',
  'Ecuador': 'ec',
  'Guyana': 'gy',
  'Paraguay': 'py',
  'Peru': 'pe',
  'Suriname': 'sr',
  'Trinidad & Tobago': 'tt',
  'Uruguay': 'uy',
  'Venezuela': 've',

  // Oceania
  'American Samoa': 'as',
  'Australia': 'au',
  'Cook Islands': 'ck',
  'Fiji': 'fj',
  'Guam': 'gu',
  'New Caledonia': 'nc',
  'New Zealand': 'nz',
  'Papua New Guinea': 'pg',
  'Samoa': 'ws',
  'Solomon Islands': 'sb',
  'Tahiti': 'pf',
  'Tonga': 'to',
  'Vanuatu': 'vu'
}
