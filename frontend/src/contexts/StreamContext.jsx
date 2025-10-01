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
  const [connectionError, setConnectionError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const { authUser } = useAuthUser();

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initializeClient = async (attempt = 0) => {
      if (!tokenData?.token || !authUser || !STREAM_API_KEY || isConnecting) {
        if (!STREAM_API_KEY) {
          console.error("VITE_STREAM_API_KEY is not configured");
          setConnectionError("Stream API key is not configured");
        }
        return;
      }

      try {
        setIsConnecting(true);
        setConnectionError(null);
        console.log(`Initializing Stream client... (attempt ${attempt + 1})`);

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

          // Set a timeout for connection
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Connection timeout')), 10000);
          });

          // Wait for connection to complete with timeout
          await Promise.race([connectPromise, timeoutPromise]);
          console.log("Stream user connected successfully");
          
          // Add connection event listeners
          streamClient.on('connection.changed', (event) => {
            console.log('Stream connection changed:', event.type);
            if (event.type === 'connection.recovered') {
              setConnectionError(null);
            }
          });

          streamClient.on('connection.error', (error) => {
            console.error('Stream connection error:', error);
            setConnectionError(error.message);
          });
        }
        
        setClient(streamClient);
        setRetryCount(0); // Reset retry count on success
      } catch (error) {
        console.error("Error initializing Stream client:", error);
        setConnectionError(error.message);
        
        // Retry logic
        if (attempt < MAX_RETRIES) {
          console.log(`Retrying connection in ${RETRY_DELAY}ms... (${attempt + 1}/${MAX_RETRIES})`);
          setRetryCount(attempt + 1);
          setTimeout(() => {
            initializeClient(attempt + 1);
          }, RETRY_DELAY * (attempt + 1)); // Exponential backoff
        } else {
          console.error("Max retries reached. Stream connection failed.");
        }
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
    connectionError,
    retryCount,
    isReady: !!client && !isConnecting && !!client?.user,
  };

  return (
    <StreamContext.Provider value={value}>
      {children}
    </StreamContext.Provider>
  );
};
