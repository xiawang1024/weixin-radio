import * as types from './mutation-types'

export const setShareConf = ({ commit }, payload) => {  
  commit(types.SET_SHARE_CONF, payload) 
}

export const setCommentListInfo = ({ commit }, payload) => {
  commit(types.SET_COMMENT_LIST_INFO, payload)
}