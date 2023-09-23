import Pusher from "pusher";
import dotenv from "dotenv";

dotenv.config();

const pusher = new Pusher({
  appId: process.env.PUSHER_API_ID as string,
  key: process.env.PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: "ap1",
  useTLS: true,
});

export default pusher;
