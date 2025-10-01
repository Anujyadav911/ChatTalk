import { createContext, useContext, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const StreamContext = createContext();

export const useStreamContext = () => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error("useStreamContext must be used within StreamProvider");
  }
  return context;
};

export const StreamProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initializeClient = async () => {
      if (!tokenData?.token || !authUser || !STREAM_API_KEY || isConnecting) {
        return;
      }

      try {
        setIsConnecting(true);
        console.log("Initializing Stream client...");

        const streamClient = StreamChat.getInstance(STREAM_API_KEY);

        // Disconnect if already connected to a different user
        if (streamClient.user && streamClient.user.id !== authUser._id) {
          console.log("Disconnecting previous user...");
          await streamClient.disconnectUser();
        }

        // Only connect if not already connected as this user
        if (!streamClient.user || streamClient.user.id !== authUser._id) {
          const connectPromise = streamClient.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profilePic,
            },
            tokenData.token
          );

          // Wait for connection to complete
          await connectPromise;
          console.log("Stream user connected successfully");
          
          // Add connection event listeners
          streamClient.on('connection.changed', (event) => {
            console.log('Stream connection changed:', event.type);
          });
        }
        
        setClient(streamClient);
      } catch (error) {
        console.error("Error initializing Stream client:", error);
      } finally {
        setIsConnecting(false);
      }
    };

    initializeClient();

  }, [tokenData, authUser]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (client) {
        console.log("Disconnecting Stream client...");
        client.disconnectUser().catch(console.error);
      }
    };
  }, [client]);

  const value = {
    client,
    isConnecting,
    isReady: !!client && !isConnecting && !!client?.user,
  };

  return (
    <StreamContext.Provider value={value}>
      {children}
    </StreamContext.Provider>
  );
};
