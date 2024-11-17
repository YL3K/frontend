import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers/index';

const store = configureStore({
  reducer: rootReducer,  // 리듀서 설정
});

export default store;
