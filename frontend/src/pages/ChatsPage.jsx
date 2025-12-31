import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import { Link, useLocation } from "react-router";
import { useState } from "react";
import { SearchIcon } from "lucide-react";

const ChatsPage = () => {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });
  const location = useLocation();
  const activeChatId = location.pathname.startsWith("/chat/") ? location.pathname.split("/chat/")[1] : null;
  const [search, setSearch] = useState("");

  const filteredFriends = friends.filter(friend =>
    friend.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full bg-base-100 min-h-screen">
      <div className="w-full">
        <div className="relative px-2 py-2 bg-base-100">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-base-content/60">
            <SearchIcon className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-12 pr-4 py-2 w-full rounded-full bg-base-200 text-base focus:outline-none focus:ring-2 focus:ring-primary border-none shadow-sm placeholder:text-base-content/60 transition"
          />
        </div>
        <div className="divide-y divide-base-200">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <span className="loading loading-spinner loading-md" />
            </div>
          ) : filteredFriends.length === 0 ? (
            <div className="p-6 text-center text-base-content/70">No friends to chat with yet</div>
          ) : (
            filteredFriends.map((friend) => (
              <Link
                key={friend._id}
                to={`/chat/${friend._id}`}
                className={`flex items-center gap-4 px-4 py-3 w-full hover:bg-base-200 transition cursor-pointer ${activeChatId === friend._id ? "bg-base-300" : ""}`}
              >
                <img
                  src={friend.profilePic}
                  alt={friend.fullName}
                  className="w-10 h-10 rounded-full object-cover border border-base-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base-content truncate">{friend.fullName}</div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsPage; 