'use client'

import { useState, useEffect, useCallback } from 'react'
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ILocalTrack,
} from 'agora-rtc-react'

export default function useAgora(appId: string) {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null)
  const [localAudioTrack, setLocalAudioTrack] = useState<ILocalTrack | null>(null)
  const [localVideoTrack, setLocalVideoTrack] = useState<ILocalTrack | null>(null)
  const [joinState, setJoinState] = useState(false)
  const [remoteUsersSet, setRemoteUsersSet] = useState<Set<IAgoraRTCRemoteUser>>();

  useEffect(() => {
    const init = async () => {
      const newClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
      setClient(newClient)
    }
    init()
    return () => {
      if (localAudioTrack) {
        localAudioTrack.close()
      }
      if (localVideoTrack) {
        localVideoTrack.close()
      }
      client?.leave()
    }
  }, [])

  const join = useCallback(
    async (channel: string, token: string | null) => {
      if (!client) return
      const uid = await client.join(appId, channel, token, null)
      console.log("uid is ", uid);
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack()
      const videoTrack = await AgoraRTC.createCameraVideoTrack()
      await client.publish([audioTrack, videoTrack])
      setLocalAudioTrack(audioTrack)
      setLocalVideoTrack(videoTrack)
      setJoinState(true)
    },
    [appId, client]
  )

  const leave = useCallback(async () => {

    if (localAudioTrack) {
      localAudioTrack.close()
    }

    if (localVideoTrack) {
      localVideoTrack.close()
    }

    await client?.leave()
    setRemoteUsersSet(new Set(client?.remoteUsers));
  }, [client, localAudioTrack, localVideoTrack])

  useEffect(() => {
    if (!client) return
    setRemoteUsersSet(new Set(client.remoteUsers));

    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      await client.subscribe(user, mediaType)
      setRemoteUsersSet(new Set(client.remoteUsers));
    }

    const handleUserUnpublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      await client.unsubscribe(user, mediaType);
      setRemoteUsersSet(new Set(client.remoteUsers));
    }

    client.on('user-published', handleUserPublished)
    client.on('user-unpublished', handleUserUnpublished)

    return () => {
      client.off('user-published', handleUserPublished)
      client.off('user-unpublished', handleUserUnpublished)
    }
  }, [client, localVideoTrack, localAudioTrack])

  const muteAudio = useCallback(() => {
    if (localAudioTrack) {
      localAudioTrack.setEnabled(!localAudioTrack.isPlaying)
    }
  }, [localAudioTrack])

  const muteVideo = useCallback(() => {
    if (localVideoTrack) {
      localVideoTrack.setEnabled(!localVideoTrack.isPlaying)
    }
  }, [localVideoTrack])


  const startScreenShare = useCallback(async () => {
    if (!client) return;

    try {
      const screenTrack = await AgoraRTC.createScreenVideoTrack({}, "disable");
      await client.unpublish(localVideoTrack as ILocalTrack);
      await client.publish(screenTrack);
      setLocalVideoTrack(screenTrack);
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  }, [client, localVideoTrack]);

  const stopScreenShare = useCallback(async () => {
    if (!client || !localVideoTrack) return;

    try {
      await client.unpublish(localVideoTrack as ILocalTrack);
      const cameraTrack = await AgoraRTC.createCameraVideoTrack();
      await client.publish(cameraTrack);
      setLocalVideoTrack(cameraTrack);
    } catch (error) {
      console.error("Error switching to camera:", error);
    }
  }, [client, localVideoTrack]);

  return {
    client,
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
    remoteUsersSet,
    muteAudio,
    muteVideo,
    startScreenShare,
    stopScreenShare,
  }
}

