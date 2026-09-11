import mongoose from "mongoose";
import { encrypt } from "../../Utils/security/encryption.security.js";

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Message content is required"],
    minlength: [2, "Message content must be at least 2 characters long"],
    maxlength: [500, "Message content must be at most 500 characters long"],
    trim: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Receiver is required"]
  },
  isRead:{ type: Boolean, default: false },
  isFavorite:{ type: Boolean, default: false }
},{timestamps: true});

messageSchema.index({ receiverId: 1 });

messageSchema.pre('save', async function() {
  try {
    if (this.isModified('content')){
    this.content = await encrypt(this.content);
  };
  } catch (error) {
    console.error(error);
  }
});

const MessageModel = mongoose.model('Message', messageSchema);

export default MessageModel;