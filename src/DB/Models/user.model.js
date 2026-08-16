import mongoose from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../Utils/enums/user.enum.js";

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
  forgetPasswordOTP:String,
  profileImage:String,
  coverImages:[String],
  changeCredentialsTime:Date
},{timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }});

userSchema.virtual('userName').set(function(value) {
  const [firstName, lastName] = value.split(' ') || [];
  this.set({ firstName, lastName });
}).get(function() {
  return `${this.firstName} ${this.lastName}`;
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;