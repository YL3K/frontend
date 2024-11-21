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
  const [expanded, setExpanded] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const animation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const userInform = useSelector((state) => state.user.user);

  const userName = userInform.userName;
  const { customerId, counselorId } = useSelector((state) => state.counsel);
  let roomId;
  const userType = userInform.userType;

  const createRoom = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:8080/api/v1/counsel',
        {
          customerId,
          counselorId,
        },
        {
          headers: {
            Authorization: `Bearer ${userInform.accessToken}`  
          },
        }); 
      roomId = response.data.response.data
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
    } catch (e) {
      console.error("Error accessing media devices:", e);
    }
  };

  const setupWebSocket = () => {
    wsRef.current = new WebSocket("ws://10.0.2.2:8080/ws");

    wsRef.current.onopen = () => {
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
        setRemoteStream(e.streams[0]);
      } else {
        console.error("No streams available in ontrack event");
      }
    };
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
      await axios.patch(`http://10.0.2.2:8080/api/v1/counsel/start/${roomId}`,{}, {
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
      await axios.patch(`http://10.0.2.2:8080/api/v1/counsel/end/${roomId}`,{}, {
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
          <Icon name={expanded ? 'menu-right' : 'menu-left'} size={24} color="black" />
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
          style={styles.localVideo}
          streamURL={localStream.toURL()}
          objectFit="cover"
        />
      ) : (
        <View style={styles.localVideo}></View>
      )}
      
      {remoteStream ? (
        <RTCView 
          streamURL={remoteStream.toURL()}
          style={styles.remoteVideo}
          objectFit="cover"
        />
      ) : (
        <View style={styles.remoteVideo}></View>
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
    width: "100%",
    flex: 4,
  },
  remoteVideo: {
    width: "100%",
    flex: 6,
  },
});

export default VideoConsultScreen;