import http from './http'
import { routes } from './routes'

function parentId (parent) {
  return parent ? `${parent}Id` : ''
}

function dataId (model) {
  const title = model.title.replace(/\s/g, '')
  return `${title.charAt(0).toLowerCase()}${title.slice(1)}Id`
}

function dataName (model) {
  return model.title.replace(/\s/g, '_').toLowerCase()
}

export function fetch ({ model, parent }) {
  const $parentId = parentId(parent)
  return ({ rootState }, pathData) => http({
    path: routes[model.entity].index,
    pathData: { [$parentId]: pathData[$parentId] },
    token: rootState.token,
    success ({ data }) {
      model.insert({ data })
    }
  })
}

export function get ({ model }) {
  const $id = dataId(model)
  return ({ rootState }, pathData) => http({
    path: routes[model.entity].record,
    pathData: { [$id]: pathData[$id] },
    token: rootState.token,
    success ({ data }) {
      model.insert({ data })
    }
  })
}

export function create ({ model, parent }) {
  const $parentId = parentId(parent)
  const $data = dataName(model)
  return ({ commit, rootState }, data) => http({
    method: 'post',
    path: routes[model.entity].index,
    pathData: { [$parentId]: data[$parentId] },
    token: rootState.token,
    data: { [$data]: data[$data] },
    success ({ data }) {
      model.insert({ data })

      commit('broadcaster/ANNOUNCE', {
        message: `${model.title} has been added.`,
        color: 'success'
      }, { root: true })
    }
  })
}

export function update ({ model }) {
  const $id = dataId(model)
  const $data = dataName(model)
  return ({ commit, rootState }, data) => http({
    method: 'patch',
    path: routes[model.entity].record,
    pathData: { [$id]: data.id },
    token: rootState.token,
    data: { [$data]: data },
    success ({ data }) {
      model.insert({ data })

      commit('broadcaster/ANNOUNCE', {
        message: `${model.title} has been updated.`,
        color: 'success'
      }, { root: true })
    }
  })
}

export function remove ({ model }) {
  const $id = dataId(model)
  return ({ commit, rootState }, id) => http({
    method: 'delete',
    path: routes[model.entity].record,
    pathData: { [$id]: id },
    token: rootState.token,
    success ({ data }) {
      model.delete(data.id)

      commit('broadcaster/ANNOUNCE', {
        message: `${model.title} has been removed.`,
        color: 'success'
      }, { root: true })
    }
  })
}

export const crud = ({ model, parent }) => ({
  FETCH: fetch({ model, parent }),
  GET: get({ model }),
  CREATE: create({ model, parent }),
  UPDATE: update({ model }),
  REMOVE: remove({ model })
})
