const initialState = {
  user: null, // 회원 정보
  isLoggedIn: false, // 로그인 상태
};
  
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_USER':
      return {
        ...state,
        user: action.payload, // 사용자 정보 저장
        isLoggedIn: true,
      };
    case 'LOGOUT_USER':
      return {
        ...state,
        user: null, // 사용자 정보 초기화
        isLoggedIn: false,
      };
    default:
      return state;
  }
};
  
export default userReducer;  