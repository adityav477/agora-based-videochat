'use client'
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
const VideoCall = dynamic(() => import('@/components/VideoCall'), { ssr: false });

function CallerPage() {
  const [channelName, setChannelName] = useState<string>("");

  useEffect(() => {
    if (typeof window !== undefined) {
      const channelName = localStorage.getItem("channelName");

      if (channelName) {
        setChannelName(channelName);
      }

    }
  }, [])

  return (
    <div className="w-screen h-screen flex justify-center items-center ">
      <VideoCall channelName={channelName} />
    </div>
  )
}

export default CallerPage
