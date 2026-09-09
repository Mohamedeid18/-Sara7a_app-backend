import mongoose from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../Utils/enums/user.enum.js";
import { defaultProfileImage } from "../../Utils/assets/defualtProfileImage.js";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require:[true, "FirstName is required"],
    minlength:2,
    maxlength:25
  },
  lastName: {
    type: String,
    require:[true, "LastName is required"],
    minlength:2,
    maxlength:25
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function() {
      return this.provider === ProviderEnum.SYSTEM;
    }
  },
  DOB:Date,
  phone:String,
  gender:{
    type: String,
    enum: Object.values(GenderEnum),
    default: GenderEnum.MALE
  },
  role:{
    type: String,
    enum: Object.values(RoleEnum),
    default: RoleEnum.USER
  },
  provider:{
    type: String,
    enum: Object.values(ProviderEnum),
    default: ProviderEnum.SYSTEM
  },
  confirmEmail:Date,
  confirmEmailOTP:String,
  confirmEmailOTPExpires:Date,
  forgetPasswordOTP:String,
  forgetPasswordOTPExpires:Date,
  profileImage:{
    secure_url: String,
    public_id: String
  },
  coverImages:[String],
  changeCredentialsTime:Date,
  freezeBy:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  freezeAt:Date,
  freezeByRole:{
    type:String,
    enum:Object.values(RoleEnum)
  },
  restoredBy:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  restoredAt:Date,


},{timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }});

userSchema.virtual('userName').set(function(value) {
  const [firstName, lastName] = value.split(' ') || [];
  this.set({ firstName, lastName });
}).get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre("save", async function () {
  if (!this.profileImage || !this.profileImage.secure_url) {
    const { secure_url, public_id } = defaultProfileImage(this.gender);
    this.profileImage = { secure_url, public_id };
  }
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;