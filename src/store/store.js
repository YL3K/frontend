import { createStore } from 'redux';

// 초기 상태
const initialState = {
  counter: 0,
};

// 리듀서 함수
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, counter: state.counter + 1 };
    case 'DECREMENT':
      return { ...state, counter: state.counter - 1 };
    default:
      return state;
  }
};

// 스토어 생성
const store = createStore(reducer);

export default store;
