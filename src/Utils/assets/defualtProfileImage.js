import { GenderEnum } from "../enums/user.enum.js";

export const defaultProfileImage = (gender) => {
  return gender === GenderEnum.FEMALE
    ? {
        secure_url:
          "https://res.cloudinary.com/cixlsuff/image/upload/v1788914785/woman-profile-avatar.jpg",
        public_id: "woman-profile-avatar",
      }
    : {
        secure_url:
          "https://res.cloudinary.com/cixlsuff/image/upload/v1788914821/98c9092b-284f-4234-9e17-40d9a65de492.png",
        public_id: "98c9092b-284f-4234-9e17-40d9a65de492",
      };
};
