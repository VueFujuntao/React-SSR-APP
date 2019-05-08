// 合併狀態
import {
  combineReducers
} from 'redux';
// 状态
import {
  dataSource
} from './module/dataSource.js';

export default combineReducers({
  dataSource: dataSource
})
