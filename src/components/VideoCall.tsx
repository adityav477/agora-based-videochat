'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Video, VideoOff, ScreenShare, PhoneOff, ScreenShareOff } from 'lucide-react'
import useAgora from '@/hooks/useAgora'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { UID } from 'agora-rtc-react'

export default function VideoCall({ channelName }: { channelName: string }) {
  const [appId] = useState(process.env.NEXT_PUBLIC_AGORA_API_KEY)
  const [channel] = useState(channelName || 'test')
  const [token] = useState(null) // Use null for testing, implement token server for production
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [screenShare, setScreenShare] = useState<boolean>(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteUsersRef = useRef<Map<UID, HTMLVideoElement>>(new Map());

  const {
    localVideoTrack,
    leave,
    join,
    joinState,
    remoteUsersSet,
    muteAudio,
    muteVideo,
    startScreenShare,
    stopScreenShare,
  } = useAgora(appId!)

  useEffect(() => {
    if (appId && channel) {
      join(channel, token)
    }
  }, [appId, channel, token, join])

  useEffect(() => {
    if (localVideoTrack && localVideoRef.current)
      localVideoTrack.play(localVideoRef.current);
  }, [localVideoTrack])

  useEffect(() => {
    if (remoteUsersSet && remoteUsersRef.current) {
      remoteUsersSet.forEach(user => {
        const videoRef = remoteUsersRef.current.get(user.uid);
        if (user.videoTrack) {
          user.videoTrack.play(videoRef!);
        }
      })
    }

  }, [remoteUsersSet])

  const handleScreenShare = async () => {
    setScreenShare(prevValue => !prevValue);

    if (screenShare) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  }

  const router = useRouter();


  return (
    <div className="w-full max-w-4xl ">
      <h1 className='fixed top-36 right-0 w-full text-center md:text-3xl text-2xl font-semibold '>Room {channelName}</h1>
      <div className="grid grid-cols-2 gap-4 mb-4 ">
        {joinState && localVideoTrack && (
          <div className="relative">
            <div id="local-player" className="h-60 bg-gray-800 rounded-lg overflow-hidden">
              <video ref={localVideoRef}>
              </video>
            </div>
            <p className="absolute bottom-2 left-2 text-white">You</p>
          </div>
        )}
        {Array.from(remoteUsersSet || []).map((user) => (
          <div key={user.uid} className="relative">
            <div id={`player-${user.uid}`} className="h-60 bg-gray-800 rounded-lg overflow-hidden">
              {user.hasVideo && (
                <video
                  ref={(v) => {
                    if (v && user.videoTrack) {
                      user.videoTrack.play(v);
                      remoteUsersRef.current.set(user.uid, v);
                    }
                  }}
                  autoPlay
                  playsInline
                ></video>
              )}
            </div>
            <p className="absolute bottom-2 left-2 text-white">Remote User {user.uid}</p>
          </div>
        ))}
      </div>
      <div className="w-screen fixed bottom-32 right-0 text-center flex justify-center space-x-4">
        <Button onClick={() => {
          muteAudio();
          setVoiceEnabled(prevValue => !prevValue);
        }}
          variant="outline">
          {voiceEnabled ? <Mic /> : <MicOff />}
        </Button>

        <Button onClick={() => {
          muteVideo();
          setVideoEnabled(prevValue => !prevValue);
        }}
          variant="outline">
          {videoEnabled ? < Video /> : <VideoOff />}
        </Button>

        <Button onClick={handleScreenShare} variant="outline">
          {screenShare ?
            <ScreenShareOff /> :
            <ScreenShare />
          }
        </Button>

        <Button onClick={() => {
          leave();
          router.push("/");
        }} variant="destructive">
          <PhoneOff />
        </Button>
      </div>
    </div >
  )
}


