'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'


function AddRoom() {
  const [channelName, setChannelName] = useState("");

  const router = useRouter();

  const handleChannelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelName(e.target.value);
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("channelName", channelName);
    router.push(`/video`)
  }

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
      <form onSubmit={handleFormSubmit}>
        <div className="flex flex-col h-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
            Join A Room
          </h2>
          <p className="text-gray-600 text-sm text-center mb-6">
            Enter channel name and display name
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="channelName" className="block text-sm font-medium text-gray-700 mb-1">
                Channel Name
              </label>
              <input
                id="channelName"
                type="text"
                placeholder="Enter channel name"
                onChange={handleChannelChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Join
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddRoom
