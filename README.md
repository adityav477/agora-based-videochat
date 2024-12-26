
# Agora Video Streaming App

This application is built using the Agora RTC SDK to enable real-time video and audio communication. It supports features like screen sharing, remote user video rendering, muting/unmuting audio and video, and clean session handling.

---

## Features

1. **Real-time Video and Audio Communication**:
   - Users can join a channel and communicate with others via audio and video.

2. **Screen Sharing**:
   - Users can share their screens with others in the channel.
   - Switch back to camera streaming after stopping screen sharing.

3. **Remote User Video Rendering**:
   - Renders videos of remote users dynamically as they join or leave the channel.

4. **Audio and Video Controls**:
   - Mute/unmute audio and video for the local user.

5. **Session Management**:
   - Proper handling of user sessions, ensuring clean join/leave processes.

---

## Prerequisites

1. An Agora account to obtain the App ID.
2. Node.js installed on your system.
3. Basic knowledge of React and TypeScript.

---

## Installation

1. Clone the repository:

   ```bash
   git clone <https://github.com/adityav477/agora-based-videochat>
   ```

2. Install dependencies:

   ```bash
   cd agora-based-videochat 
   npm install
   ```

3. Create a `.env` file and add your Agora App ID:

   ```env
   NEXT_PUBLIC_AGORA_API_KEY=your-agora-app-id
   ```

4. Start the development server:

   ```bash
   npm start
   ```

---

## Visit App

URL -> <https://agora-based-videochat.vercel.app/>

---

## Docker Install

1. In the root folder

  ```sh
    docker compose up --build
  ```

## Usage

### Joining a Channel

1. Call the `join` function with the channel name and token:

   ```ts
   join(channelName);
   ```

### Leaving a Channel

1. Call the `leave` function to exit the channel and clean up resources:

   ```ts
   leave();
   ```

### Screen Sharing

1. Start screen sharing by calling:

   ```ts
   startScreenShare();
   ```

2. Stop screen sharing and switch back to the camera using:

   ```ts
   stopScreenShare();
   ```

### Muting Audio and Video

1. Mute/unmute audio:

   ```ts
   muteAudio();
   ```

2. Mute/unmute video:

   ```ts
   muteVideo();
   ```

### Rendering Remote User Videos

- Remote users are dynamically rendered using:

  ```tsx
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
  ```

---

## Key Files and Components

### `useAgora.ts`

- Custom React hook that manages Agora client initialization, state management, and functionalities like joining, leaving, screen sharing, and user events.

### Remote User Rendering

- Dynamically renders video streams of remote users.

---

## Known Issues

- Ensure browser permissions for camera and microphone are granted.
- Screen sharing may not work on unsupported browsers.

---

## License

This project is licensed under the MIT License.
