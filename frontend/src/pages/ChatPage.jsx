import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { ensureUsersInStream } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import { useStreamContext } from "../contexts/StreamContext";

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();
  const { client: streamClient, isReady } = useStreamContext();

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;
    
    const initChat = async () => {
      if (!streamClient || !authUser || !targetUserId) {
        setLoading(false);
        return;
      }

      // Check if client is properly connected
      if (!streamClient.user) {
        console.log("Stream client not connected yet, retrying...", retryCount);
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(() => initChat(), 1000); // Retry after 1 second
          return;
        } else {
          console.error("Max retries reached, Stream client not connected");
          toast.error("Failed to connect to chat service");
          setLoading(false);
          return;
        }
      }

      try {
        console.log("Initializing chat channel...");
        console.log("Stream client user:", streamClient.user.id);
        
        // Ensure both users are registered with Stream before creating channel
        console.log("Ensuring both users are registered with Stream...");
        await ensureUsersInStream(targetUserId);
        console.log("Users ensured in Stream successfully");

        const channelId = [authUser._id, targetUserId].sort().join("-");
        console.log("Channel ID:", channelId);

        const currChannel = streamClient.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();
        console.log("Channel initialized successfully");

        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        console.error("Error details:", error.message);
        toast.error(`Could not connect to chat: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [streamClient, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !streamClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh] ">
      <Chat client={streamClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
export default ChatPage;
