// 'use client';

// import { ReactNode, useEffect, useState } from 'react';
// import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
// import { useUser } from '@clerk/nextjs';

// import { tokenProvider } from '@/actions/stream.actions';
// import Loader from '@/components/Loader';

// const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

// const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
//   const [videoClient, setVideoClient] = useState<StreamVideoClient>();
//   const { user, isLoaded } = useUser();

//   useEffect(() => {
//     if (!isLoaded || !user) return;
//     if (!API_KEY) throw new Error('Stream API key is missing');

//     const client = new StreamVideoClient({
//       apiKey: API_KEY,
//       user: {
//         id: user?.id,
//         name: user?.username || user?.id,
//         image: user?.imageUrl,
//       },
//       tokenProvider,
//     });

//     setVideoClient(client);
//   }, [user, isLoaded]);

//   if (!videoClient) return <Loader />;

//   return <StreamVideo client={videoClient}>{children}</StreamVideo>;
// };

// export default StreamVideoProvider;




'use client';

import { ReactNode, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';

import Loader from '@/components/Loader';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const initStreamClient = async () => {
      if (!isLoaded || !user) return;
      if (!API_KEY) throw new Error('Stream API key is missing');

      const tokenResponse = await fetch('/api/token');
      const data = await tokenResponse.json();

      if (!data.token) {
        throw new Error('Failed to fetch token');
      }

      const client = new StreamVideoClient({
        apiKey: API_KEY,
        user: {
          id: user.id,
          name: user.username || user.id,
          image: user.imageUrl,
        },
        token: data.token,
      });

      setVideoClient(client);
    };

    initStreamClient();
  }, [user, isLoaded]);

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
