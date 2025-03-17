import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addMembers, deleteChat, getChatDetails, getMyChats,getMyGroups, leaveGroup, newGroupChat, removeMember, renameGroup, sendAttachments,

 } from "../controllers/chat.js";
import { attachmentsMulter } from "../middlewares/multer.js";

const app = express.Router();



app.use(isAuthenticated);

app.post("/new", newGroupChat)
app.get("/my", getMyChats)
app.get("/my/groups", getMyGroups)
app.put("/addmembers", addMembers)
app.put("/removemembers", removeMember)
app.delete("/leave/:id", leaveGroup )

// Send Attachment
app.post("/message", attachmentsMulter, sendAttachments)
// Get Messages
// Get Chat Details, rename,delete

//   app.get( "/chat/:id", A)
//   app.put("/chat/:id", B)
//   app.delete("/chat/:id", C);

// Get Chat Details, remove, and add members
app.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat);

export default app;