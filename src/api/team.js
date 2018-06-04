import axios from 'axios'
import urlFor from './root'

const subPath = {
  getAllTeams: 'teams',
  getTeam: 'teams/{{ teamId }}'
}

export default {
  getAllTeams ({ token }) {
    return axios.get(urlFor(subPath.getAllTeams), { headers: { 'Authorization': 'Bearer ' + token } })
  },
  getTeam ({ token, teamId }) {
    return axios.get(urlFor(subPath.getTeam, { teamId: teamId }), { headers: { 'Authorization': 'Bearer ' + token } })
  },
  saveTeam ({ token, team }) {
    if (team.id) {
      return axios.patch(urlFor(subPath.getTeam, { teamId: team.id }), { team: team }, { headers: { 'Authorization': 'Bearer ' + token } })
    } else {
      return axios.post(urlFor(subPath.getAllTeams), { team: team }, { headers: { 'Authorization': 'Bearer ' + token } })
    }
  }
}
