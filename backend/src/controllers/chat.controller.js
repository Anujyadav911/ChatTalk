import { generateStreamToken, upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";

export async function getStreamToken(req, res) {
  try {
    const token = generateStreamToken(req.user._id);

    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function ensureUsersInStream(req, res) {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user._id;

    // Get both users from database
    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(targetUserId)
    ]);

    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    // Ensure both users exist in Stream
    await Promise.all([
      upsertStreamUser({
        id: currentUser._id.toString(),
        name: currentUser.fullName,
        image: currentUser.profilePic || "",
      }),
      upsertStreamUser({
        id: targetUser._id.toString(),
        name: targetUser.fullName,
        image: targetUser.profilePic || "",
      })
    ]);

    console.log(`Both users upserted to Stream: ${currentUser.fullName} and ${targetUser.fullName}`);
    res.status(200).json({ success: true, message: "Users ensured in Stream" });
  } catch (error) {
    console.log("Error in ensureUsersInStream controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function syncAllUsersToStream(req, res) {
  try {
    // Get all users from database
    const users = await User.find({});
    
    console.log(`Syncing ${users.length} users to Stream...`);
    
    // Upsert all users to Stream
    const promises = users.map(user => 
      upsertStreamUser({
        id: user._id.toString(),
        name: user.fullName,
        image: user.profilePic || "",
      })
    );
    
    await Promise.all(promises);
    
    console.log(`Successfully synced ${users.length} users to Stream`);
    res.status(200).json({ 
      success: true, 
      message: `Synced ${users.length} users to Stream`,
      count: users.length 
    });
  } catch (error) {
    console.log("Error in syncAllUsersToStream controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
