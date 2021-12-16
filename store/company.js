export const state = () => ({
  companies: []
})

export const getters = {
  getCompanies(state) {
    return state.companies
  }
}

export const mutations = {
  SET_COMPANIES(state, payload) {
    state.companies = payload
  }
}
