const initialState = {
    customerId: null,
    counselorId: null,
  };
  
  const counselReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_CUSTOMER_AND_COUNSELOR':
        return {
          ...state,
          customerId: action.payload.customerId,
          counselorId: action.payload.counselorId,
        };
      case 'RESET_COUNSEL_INFO':
        return initialState; // 초기 상태로 리셋
      default:
        return state;
    }
  };
  
  export default counselReducer;
  