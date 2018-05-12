import { SET_INDEX } from "./mutation-types"

export default {
  [SET_INDEX](state, index){
    state.index = index
  },
  // [GET_INDEX]:(state, index) => {
  //   state.index = index
  // }
}
