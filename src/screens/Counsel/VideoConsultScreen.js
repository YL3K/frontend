import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, PermissionsAndroid, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices, RTCView } from 'react-native-webrtc';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const VideoConsultScreen = () => {
  const wsRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const candidateQueue = useRef([]); 
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const userInform = useSelector((state) => state.user).user;

  const [expanded, setExpanded] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const animation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const userName = userInform.userName;
  const customerId = "5";
  const counselorId = "8";
  const userType = userInform.userType;

  const createRoom = async () => {
    try {
      await axios.post('http://10.0.2.2:8080/api/v1/counsel',
        {
          customerId,
          counselorId,
        },
        {
          headers: {
            Authorization: `Bearer ${userInform.accessToken}`  
          },
        }); 
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const getMedia = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);

      if (
        granted["android.permission.CAMERA"] !== "granted" ||
        granted["android.permission.RECORD_AUDIO"] !== "granted"
      ) {
        console.error("Permissions not granted");
        return;
      }

      const stream = await mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);
      localStreamRef.current = stream;
      stream.getTracks().forEach((track) => {
        pcRef.current.addTrack(track, stream);
      });
      console.log(userType + "> getMedia 완료");
    } catch (e) {
      console.error("Error accessing media devices:", e);
    }
  };

  const setupWebSocket = () => {
    wsRef.current = new WebSocket("ws://10.0.2.2:8080/ws");

    wsRef.current.onopen = () => {
      console.log(userType + "> WebSocket connected");
      wsRef.current.send(
        JSON.stringify({
          type: "join_room",
          customerId: customerId,
          counselorId: counselorId,
        })
      );
    };

    wsRef.current.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      switch (data.type) {
        case "new_user":
          createOffer();
          break;
        case "offer":
          await handleOffer(data.sdp);
          break;
        case "answer":
          await handleAnswer(data.sdp);
          break;
        case "candidate":
          await handleCandidate(data.candidate);
          break;
        default:
          break;
      }
    };

    wsRef.current.onerror = (e) => {
      console.error("WebSocket error:", e.message);
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket closed");
    };
    console.log(userType + "> WebSocket 등록완");
  };

  const createPeerConnection = () => {
    pcRef.current = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }, 
        {
          urls: 'turn:172.30.1.70:3478', 
          username: 'yl3k',
          credential: 'yl3k',
        }
      ],
    });

    pcRef.current.oniceconnectionstatechange = () => {
      console.log(
        userType + "ICE Connection State Changed:",
        pcRef.current.iceConnectionState
      );
    };

    pcRef.current.onicecandidate = (e) => {
      if (e.candidate) {
        wsRef.current.send(
          JSON.stringify({
            type: "candidate",
            candidate: e.candidate,
            customerId: customerId,
            counselorId: counselorId,
          })
        );
      }
    };

    pcRef.current.ontrack = (e) => {
      if (e.streams && e.streams[0]) {
        console.log(userType, "$$$$$$ Track received, stream:", e.streams[0]);
        setRemoteStream(e.streams[0]);
      } else {
        console.error("No streams available in ontrack event");
      }
    };
    
    console.log(userType + "&&& RTC 생성 및 이벤트들 등록");
  };

  // A만 수행
  const createOffer = async () => {
    try {
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);
      wsRef.current.send(
        JSON.stringify({
          type: "offer",
          customerId: customerId,
          counselorId: counselorId,
          sdp: offer,
        })
      );
      await axios.patch(`http://10.0.2.2:8080/api/v1/counsel/start/${customerId+"_"+counselorId}`,{}, {
        headers: {
          Authorization: `Bearer ${userInform.accessToken}`  
        }
      }); 
    } catch (e) {
      console.error("Error creating offer:", e);
    }
  };

  // B만 수행
  const handleOffer = async (message) => {
    console.log(userType, "오퍼 받음#######3 앤서 날림", message)
    try {
      await pcRef.current.setRemoteDescription(
        new RTCSessionDescription({ type: "offer", sdp: message.sdp })
      );
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);
      wsRef.current.send(
        JSON.stringify({
          type: "answer",
          customerId: customerId,
          counselorId: counselorId,
          sdp: answer.sdp,
        })
      );
      processCandidateQueue(); // Remote Description 설정 후 Candidate 큐 처리
    } catch (e) {
      console.error("Error handling offer:", e);
    }
  };

  // A만 수행
  const handleAnswer = async (sdp) => {
    console.log(userType, "######33앤써 받음")
    try {
      await pcRef.current.setRemoteDescription(
        new RTCSessionDescription({ type: "answer", sdp: sdp })
      );
      processCandidateQueue(); // Remote Description 설정 후 Candidate 큐 처리
    } catch (e) {
      console.error("Error handling answer:", e);
    }
  };

  const handleCandidate = async (candidate) => {
    if (pcRef.current.remoteDescription) {
      try {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error("Error adding ICE Candidate:", e);
      }
    } else {
      candidateQueue.current.push(candidate); // Candidate를 큐에 저장
    }
  };

  const processCandidateQueue = async () => {
    while (candidateQueue.current.length > 0) {
      const candidate = candidateQueue.current.shift(); 
      try {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error("Error processing queued ICE Candidate:", e);
      }
    }
  };

  const endSession = async () => {
    try {
      await axios.patch(`http://10.0.2.2:8080/api/v1/counsel/end/${customerId+"_"+counselorId}`,{}, {
        headers: {
          Authorization: `Bearer ${userInform.accessToken}`  
        }
      }); 
    } catch (error) {
      console.error('Error closing session:', error);
    }
  };

  const toggleMenu = () => {
    setExpanded(!expanded);
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1, 
      duration: 300, 
      useNativeDriver: false,
    }).start();
  };

  const menuWidth = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 230], 
  });

  const menuItemsOpacity = animation.interpolate({
    inputRange: [0, 1], 
    outputRange: [0, 1],
  });

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled; 
        setIsAudioEnabled(audioTrack.enabled); 
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled; 
        setIsVideoEnabled(videoTrack.enabled); 
      }
    }
  };

  useEffect(() => {
    createRoom()
    setupWebSocket();
    createPeerConnection();
    getMedia();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (pcRef.current) {
        pcRef.current.close();
      }
      if (wsRef.current) {
        wsRef.current.close();
      }

      endSession();
      // 완료 페이지로 이동..?
      navigation.navigate('EndSession'); 
    };
  }, []);


  return (
    <View style={styles.container}>
      <Animated.View style={[styles.btnscontainer, { width: menuWidth }]}>

        <TouchableOpacity style={styles.toggleButton} onPress={toggleMenu}>
          <Icon name={expanded ? 'menu-left' : 'menu-right'} size={24} color="black" />
        </TouchableOpacity>

        <Animated.View style={[styles.menuItems, { opacity: menuItemsOpacity }]}>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => console.log('기록이랑 연결!')}
          >
            <Icon name="note-text-outline" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.circleButton}
            onPress={toggleAudio}
          >
            <Icon
              name={isAudioEnabled ? 'microphone' : 'microphone-off'}
              size={24}
              color="black"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.circleButton}
            onPress={toggleVideo}
          >
            <Icon
              name={isVideoEnabled ? 'camera' : 'camera-off'}
              size={24}
              color="black"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.circleButton}>
            <Icon name="phone-off" size={24} color="red" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
      
      {localStream ? (
        <RTCView
          streamURL={localStream.toURL()}
          style={styles.localVideo}
          objectFit="contain"
        />
      ) : (
        <View style={{backgroundColor:"blue"}}></View>
      )}
      
      {remoteStream ? (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={styles.remoteVideo}
          objectFit="contain"
        />
      ) : (
        <View style={{backgroundColor:"blue"}}></View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  btnscontainer: {
    position: 'absolute',
    top: 20,
    right: 0,
    backgroundColor: '#FFDD00', 
    borderRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    overflow: 'hidden', 
    zIndex: 1099
  },
  toggleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 60,
  },
  menuItems: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  circleButton: {
    width: 40,
    height: 40,
    backgroundColor: 'white', 
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 3,
  },
  localVideo: {
    position: 'absolute', 
    top: 10, 
    left: 10, 
    width: '30%',
    height: '30%', 
    zIndex: -99, 
    borderWidth:10,
    bolderColor:"red"
  },
  remoteVideo: {
    position: 'absolute', 
    width: '100%', 
    height: '100%', 
    zIndex: 99, 
  }
});

export default VideoConsultScreen;