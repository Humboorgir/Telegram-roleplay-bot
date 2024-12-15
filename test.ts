import userModel from "./models/userSchema";
import { mongoConnect } from "./utils";

async function main() {
  mongoConnect();
const userIds = ["5988772734", "1015404159", "5895283256"]

const list = await Promise.all(userIds.map(async (userId) => {
  const storedUser = await userModel.findOne({ id: userId });
  return `${userId}: ${storedUser?.obohat} OBOHAT`
}));

  console.log(list.join("\n"));
}

main();