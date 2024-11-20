const initialState = {
  fcmToken: null,
};

const fcmTokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FCM_TOKEN':
      return {
        ...state,
        fcmToken: action.payload
      };
    default:
      return state;
  }
};

export default fcmTokenReducer;