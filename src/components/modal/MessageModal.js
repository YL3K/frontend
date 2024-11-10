// // components/EndConsultationModal.js
// import React from 'react';
// import { Modal, View, Text, Button } from 'react-native';

// const CloseModal = ({ visible, onClose, onEnd }) => {
//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={onClose}
//     >
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
//         <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
//           <Text>상담을 종료하시겠습니까?</Text>
//           <Button title="상담 종료" onPress={onEnd} />
//           <Button title="취소" onPress={onClose} />
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default CloseModal;
