/**
* "$_sources" store module
*/
import Vue from 'vue'
import api from '../_api'

const types = {
  LOADING: 'loading',
  DELETING: 'deleting',
  SUCCESS: 'success',
  ERROR: 'error'
}

// Default values
const state = {
  cache: {}, // items details
  message: '',
  itemStatus: ''
}

const getters = {
  isWaiting: state => [types.LOADING, types.DELETING].includes(state.itemStatus),
  isLoading: state => state.itemStatus === types.LOADING
}

const actions = {
  all: () => {
    const params = {
      sort: 'id',
      fields: ['id', 'description', 'class'].join(',')
    }
    return api.pkiProviders(params).then(response => {
      return response.items
    })
  },
  optionsById: ({}, id) => {
    return api.pkiProviderOptions(id).then(response => {
      return response
    })
  },
  optionsByProviderType: ({}, providerType) => {
    return api.pkiProvidersOptions(providerType).then(response => {
      return response
    })
  },
  getPkiProvidersByType: ({ state, commit }, type) => {
    const params = {
      sort: 'id',
      fields: ['id', 'description', 'class'].join(','),
      type: type
    }
    return api.pkiProviders(params).then(response => {
      return response.items
    })
  },
  getPkiProvider: ({ state, commit }, id) => {
    if (state.cache[id]) {
      return Promise.resolve(state.cache[id])
    }
    commit('ITEM_REQUEST')
    return api.pkiProvider(id).then(item => {
      commit('ITEM_REPLACED', item)
      return item
    }).catch((err) => {
      commit('ITEM_ERROR', err.response)
      throw err
    })
  },
  createPkiProvider: ({ commit }, data) => {
    commit('ITEM_REQUEST')
    return api.createPkiProvider(data).then(response => {
      commit('ITEM_REPLACED', data)
      return response
    }).catch(err => {
      commit('ITEM_ERROR', err.response)
      throw err
    })
  },
  updatePkiProvider: ({ commit }, data) => {
    commit('ITEM_REQUEST')
    return api.updatePkiProvider(data).then(response => {
      commit('ITEM_REPLACED', data)
      return response
    }).catch(err => {
      commit('ITEM_ERROR', err.response)
      throw err
    })
  },
  deletePkiProvider: ({ commit }, data) => {
    commit('ITEM_REQUEST', types.DELETING)
    return api.deletePkiProvider(data).then(response => {
      commit('ITEM_DESTROYED', data)
      return response
    }).catch(err => {
      commit('ITEM_ERROR', err.response)
      throw err
    })
  }
}

const mutations = {
  ITEM_REQUEST: (state, type) => {
    state.itemStatus = type || types.LOADING
    state.message = ''
  },
  ITEM_REPLACED: (state, data) => {
    state.itemStatus = types.SUCCESS
    Vue.set(state.cache, data.id, data)
  },
  ITEM_DESTROYED: (state, id) => {
    state.itemStatus = types.SUCCESS
    Vue.set(state.cache, id, null)
  },
  ITEM_ERROR: (state, response) => {
    state.itemStatus = types.ERROR
    if (response && response.data) {
      state.message = response.data.message
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
