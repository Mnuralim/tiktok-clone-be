import User from "../models/UserModel";

export const getId = async (username: string) => {
  const user = await User.findOne({ username }).select("_id id");
  const userId = user?.id;
  return userId;
};
