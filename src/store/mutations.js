import * as types from './mutation-types'

export default {
    [types.SET_SHARE_CONF] (state, payload) {
        state.shareConf = payload
    }
}