export const setCustomerAndCounselor = (customerId, counselorId) => ({
    type: 'SET_CUSTOMER_AND_COUNSELOR',
    payload: { customerId, counselorId },
  });
  
  export const resetCounselInfo = () => ({
    type: 'RESET_COUNSEL_INFO',
  });
  