import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices, RTCView } from 'react-native-webrtc';
import { request, PERMISSIONS } from 'react-native-permissions';
import io from 'socket.io-client';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function VideoConsultScreen({ navigation }) {
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const customerId = "321"
  const counselarId = "123"
  
  async function requestPermissions() {
    try {
      const hasPermissions =
        Platform.OS === 'android'
          ? await requestAndroidPermissions()
          : await requestIOSPermissions();
      if (hasPermissions) {
        startLocalStream();
      }
    } catch (err) {
      console.warn("Permission request error: ", err);
    }
  }

  async function requestAndroidPermissions() {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
    return (
      granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
    );
  }
  
  async function requestIOSPermissions() {
    const cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
    const audioPermission = await request(PERMISSIONS.IOS.MICROPHONE);
    return cameraPermission === 'granted' && audioPermission === 'granted';
  }

  const startLocalStream = async () => {
    try {
      const stream = await mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      setLocalStream(stream);
      setupPeerConnection();
      createOffer();
    } catch (error) {
      console.error('Error starting local stream: ', error);
    }
  };

  useEffect(() => {
    const getPermission = async()=>{
      await requestPermissions();
    }

    getPermission();

    socketRef.current = io('http://10.0.2.2:9090', {
      transports: ['websocket'],
      reconnection: true,
    });
    socketRef.current.on('connect', () => {
      socketRef.current.emit('join_room', {
        customerId: customerId,
        counselarId: counselarId
      });
    });

    socketRef.current.on('offer', handleOffer);
    socketRef.current.on('answer', handleAnswer);
    socketRef.current.on('candidate', handleCandidate);
    socketRef.current.on('end_call', handleEndCall);

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      socketRef.current.disconnect();
    };
  }, []);

  const setupPeerConnection = () => {
    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        if (track.kind === 'audio' || track.kind === 'video') {
          peerConnectionRef.current.addTrack(track, localStreamRef.current);
        }
      });
    } else {
      console.error('No local stream found');
    }

    peerConnectionRef.current.onicecandidate = event => {
      if (event.candidate) {
        socketRef.current.emit('candidate', {
          customerId: customerId,
          counselarId: counselarId,
          candidate: event.candidate,
        });
      }
    };

    peerConnectionRef.current.ontrack = event => {
      setRemoteStream(event.streams[0]);
    };
  };

  const createOffer = async () => {
    try {
      const offer = await peerConnectionRef.current.createOffer();
      const offerDescription = new RTCSessionDescription(offer);
      await peerConnectionRef.current.setLocalDescription(offerDescription);
      socketRef.current.emit('offer', {
        customerId: customerId,
        counselarId: counselarId,
        sdp: offer.sdp,
      });
    } catch (error) {
      console.error('Error creating offer or setting local description: ', error);
    }
  };

  const handleOffer = async (data) => {
    const { sdp } = data;
    try {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socketRef.current.emit('answer', {
        customerId: customerId,
        counselarId: counselarId,
        sdp: answer,
      });
    } catch (error) {
      console.error("Error handling offer: ", error);
    }
  };

  const handleAnswer = async (data) => {
    const { sdp } = data;
    try {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
    } catch (error) {
      console.error("Error handling answer: ", error);
    }
  };

  const handleCandidate = async (data) => {
    const { candidate } = data;
    try {
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error("Error handling candidate: ", error);
    }
  };

  const handleEndCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
      setRemoteStream(null);
    }
    socketRef.current.emit('end_call', {
      customerId: customerId,
      counselarId: counselarId,
    });
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOff(!videoTrack.enabled);
    }
  };

  return (
    <View style={styles.container}>
      {remoteStream && (
        <RTCView streamURL={remoteStream.toURL()} style={styles.remoteVideo} />
      )}
      {localStream && (
        <RTCView streamURL={localStream.toURL()} style={styles.localVideo} />
      )}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={() => console.log('Note')}>
          <Icon name="assignment" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
          <Icon name={isMuted ? 'microphone-off' : 'microphone'} size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={toggleCamera}>
          <Icon name={isCameraOff ? 'videocam_off' : 'videocam'} size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={handleEndCall}>
          <Icon name="phone-off" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  remoteVideo: {
    flex: 1,
  },
  localVideo: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 100,
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
  },
  controls: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'yellow',
    padding: 20,
    borderRadius: 20,
  },
  controlButton: {
    marginHorizontal: 5,
  },
});

export default VideoConsultScreen;