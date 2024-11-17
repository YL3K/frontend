// 회원 정보 로딩
export const loadUser = (userInfo) => ({
    type: 'LOAD_USER',
    payload: userInfo,
});

// 로그아웃
export const logoutUser = () => ({
    type: 'LOGOUT_USER',
});