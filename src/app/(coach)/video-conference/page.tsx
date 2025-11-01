'use client';
import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const APP_ID = '8a10c44e471b4d7fb98739edd4c9fe88';
const TOKEN = null;
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

const VideoConferencePage = () => {
  const [inCall, setInCall] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [remoteUser, setRemoteUser] = useState(null);
  const [participantCount, setParticipantCount] = useState(1);
  const [someoneJoined, setSomeoneJoined] = useState<string | null>(null);
  const [hasRemoteVideo, setHasRemoteVideo] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const localTracksRef = useRef<{ audioTrack: any; videoTrack: any }>({
    audioTrack: null,
    videoTrack: null,
  });

  const localVideoPlaying = useRef(false);
  const remoteVideoPlaying = useRef(false);

  const toggleMic = async () => {
    const track = localTracksRef.current.audioTrack;
    if (track) {
      await track.setEnabled(!micEnabled);
      setMicEnabled(!micEnabled);
    }
  };

  const toggleCam = async () => {
    const track = localTracksRef.current.videoTrack;
    if (track) {
      await track.setEnabled(!camEnabled);
      setCamEnabled(!camEnabled);
    }
  };

  const joinChannel = async (name: string) => {
    if (!name) return alert('Please enter a channel name.');

    try {
      await client.join(APP_ID, name, TOKEN, null);
      console.log('✅ Joined channel:', name);

      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const videoTrack = await AgoraRTC.createCameraVideoTrack();

      localTracksRef.current.audioTrack = audioTrack;
      localTracksRef.current.videoTrack = videoTrack;

      await client.publish([audioTrack, videoTrack]);
      console.log('✅ Published tracks');
      setInCall(true);
      setChannelName(name);
    } catch (error) {
      console.error('❌ JOIN/PUBLISH FAILED:', error);
      alert('Join failed: ' + (error as any).message);
    }
  };

  const leaveChannel = async () => {
    try {
      localTracksRef.current.audioTrack?.stop();
      localTracksRef.current.videoTrack?.stop();
      localTracksRef.current.audioTrack?.close();
      localTracksRef.current.videoTrack?.close();

      await client.leave();

      localVideoPlaying.current = false;
      remoteVideoPlaying.current = false;

      setInCall(false);
      setRemoteUser(null);
      setHasRemoteVideo(false);
      setChannelName('');
    } catch (error) {
      console.error('❌ Leave failed:', error);
    }
  };

  // Setup event listeners
  useEffect(() => {
    const onUserJoined = (user: any) => {
      setSomeoneJoined(String(user.uid));
      setParticipantCount(1 + client.remoteUsers.length);
      setTimeout(() => setSomeoneJoined(null), 2000);
    };

    const onUserLeft = (user: any) => {
      if (remoteUser?.uid === user.uid) {
        setRemoteUser(null);
        setHasRemoteVideo(false);
        remoteVideoPlaying.current = false;
        remoteVideoRef.current && (remoteVideoRef.current.innerHTML = '');
      }
      setParticipantCount(1 + client.remoteUsers.length);
    };

    const onUserPublished = async (user: any, mediaType: any) => {
      await client.subscribe(user, mediaType);
      if (mediaType === 'video') {
        setRemoteUser(user);
        setHasRemoteVideo(true);
      }
      if (mediaType === 'audio') user.audioTrack?.play();
    };

    const onUserUnpublished = (user: any, mediaType: any) => {
      if (mediaType === 'video' && user.uid === remoteUser?.uid) {
        setRemoteUser(null);
        setHasRemoteVideo(false);
        remoteVideoPlaying.current = false;
        remoteVideoRef.current && (remoteVideoRef.current.innerHTML = '');
      }
    };

    client.on('user-joined', onUserJoined);
    client.on('user-left', onUserLeft);
    client.on('user-published', onUserPublished);
    client.on('user-unpublished', onUserUnpublished);

    return () => {
      client.off('user-joined', onUserJoined);
      client.off('user-left', onUserLeft);
      client.off('user-published', onUserPublished);
      client.off('user-unpublished', onUserUnpublished);
    };
  }, [remoteUser]);

  // Play local video
  useEffect(() => {
    if (!inCall || !localTracksRef.current.videoTrack || !localVideoRef.current) return;
    if (localVideoPlaying.current) return;

    localTracksRef.current.videoTrack.play(localVideoRef.current);
    localVideoPlaying.current = true;
  }, [inCall]);

  // Play remote video
  useEffect(() => {
    if (!remoteUser || !hasRemoteVideo || !remoteVideoRef.current) return;
    if (remoteVideoPlaying.current) return;

    remoteUser.videoTrack?.play(remoteVideoRef.current);
    remoteVideoPlaying.current = true;
  }, [remoteUser, hasRemoteVideo]);

  return (
    <div style={{ padding: '24px' }}>
      {!inCall ? (
        <div style={{ textAlign: 'center' }}>
          <h2>🎥 Video Conference</h2>
          <input
            type="text"
            placeholder="Enter channel name..."
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              marginTop: '8px',
            }}
          />
          <div style={{ marginTop: '12px' }}>
            <button
              onClick={() => joinChannel(channelName)}
              style={{
                backgroundColor: '#2563eb',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Join
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '12px' }}>
            <strong>Channel:</strong> {channelName} ({participantCount} online)
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              ref={remoteVideoRef}
              style={{
                width: '640px',
                height: '360px',
                backgroundColor: '#000',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              {!hasRemoteVideo && <p>Waiting for remote user...</p>}
            </div>
            <div
              ref={localVideoRef}
              style={{
                width: '240px',
                height: '135px',
                backgroundColor: '#222',
                borderRadius: '8px',
              }}
            ></div>
          </div>

          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button
              onClick={toggleMic}
              style={{
                marginRight: '8px',
                backgroundColor: micEnabled ? '#22c55e' : '#9ca3af',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
              }}
            >
              {micEnabled ? 'Mute' : 'Unmute'}
            </button>
            <button
              onClick={toggleCam}
              style={{
                marginRight: '8px',
                backgroundColor: camEnabled ? '#f59e0b' : '#9ca3af',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
              }}
            >
              {camEnabled ? 'Camera Off' : 'Camera On'}
            </button>
            <button
              onClick={leaveChannel}
              style={{
                backgroundColor: '#dc2626',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
              }}
            >
              Leave
            </button>
          </div>

          {someoneJoined && (
            <div
              style={{
                position: 'fixed',
                bottom: '16px',
                right: '16px',
                backgroundColor: '#f59e0b',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
            >
              👋 User {someoneJoined} joined
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoConferencePage;
