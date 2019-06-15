import http from './http'
import { routes } from './routes'

export function fetch ({ model, route, parentId }) {
  return ({ rootState }, pathData) => http({
    path: routes[route].index,
    pathData: { [parentId]: pathData[parentId] },
    token: rootState.token,
    success ({ data }) {
      model.insert({ data })
    }
  })
}

export function get ({ model, route, recordId }) {
  return ({ rootState }, pathData) => http({
    path: routes[route].record,
    pathData: { [recordId]: pathData[recordId] },
    token: rootState.token,
    success ({ data }) {
      model.insert({ data })
    }
  })
}

export function create ({ model, route, parentId, dataName }) {
  return ({ commit, rootState }, data) => http({
    method: 'post',
    path: routes[route].index,
    pathData: { [parentId]: data[parentId] },
    token: rootState.token,
    data: { [dataName]: data[dataName] },
    success ({ data }) {
      model.insert({ data })

      commit('broadcaster/ANNOUNCE', {
        message: `${model.name} has been added.`,
        color: 'success'
      }, { root: true })
    }
  })
}

export function update ({ model, route, recordId, dataName }) {
  return ({ commit, rootState }, data) => http({
    method: 'patch',
    path: routes[route].record,
    pathData: { [recordId]: data.id },
    token: rootState.token,
    data: { [dataName]: data },
    success ({ data }) {
      model.insert({ data })

      commit('broadcaster/ANNOUNCE', {
        message: `${model.name} has been updated.`,
        color: 'success'
      }, { root: true })
    }
  })
}

export function remove ({ model, route, recordId }) {
  return ({ commit, rootState }, id) => http({
    method: 'delete',
    path: routes[route].record,
    pathData: { [recordId]: id },
    token: rootState.token,
    success ({ data }) {
      model.delete(data.id)

      commit('broadcaster/ANNOUNCE', {
        message: `${model.name} has been removed.`,
        color: 'success'
      }, { root: true })
    }
  })
}

export const crud = ({ model, route, parentId, recordId, dataName }) => ({
  FETCH: fetch({ model, route, parentId }),
  GET: get({ model, route, recordId }),
  CREATE: create({ model, route, parentId, dataName }),
  UPDATE: update({ model, route, recordId, dataName }),
  REMOVE: remove({ model, route, recordId })
})
