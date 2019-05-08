const ERROR_MSG = 'ERROR_MSG';
const REGISTER_SUCCESS = 'REGISTER_SUCCESS';

// 默认值
const initState = {
  pageSize: 10,
}

export function dataSource(state = initState, action) {
  switch (action.type) {
    case ERROR_MSG:
      return state
    case REGISTER_SUCCESS:
      return {...state, ...action.payload}
    default:
      return state
  }
}

// 成功調用
function registerSuccess(data) {
  return {
    type: REGISTER_SUCCESS,
    payload: data
  }
}

export function setSourceDataInput(data) {
  return dispatch => {
    dispatch(registerSuccess({pageSize: data}));
  }
}