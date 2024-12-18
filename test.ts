// import userModel from "./models/userSchema";
// import { mongoConnect } from "./utils";

// async function main() {
//   mongoConnect();
// const userIds = ["5988772734", "1015404159", "5895283256"]

// const list = await Promise.all(userIds.map(async (userId) => {
//   const storedUser = await userModel.findOne({ id: userId });
//   return `${userId}: ${storedUser?.obohat} OBOHAT`
// }));

//   console.log(list.join("\n"));
// }

// main();

async function main() {
  const recentlyThanked = new Map();

  const author = {
    id: "1",
  };

  const userBeingThanked = {
    id: "2",
  };

  recentlyThanked.set(author.id, userBeingThanked.id);

  setTimeout(() => {
    recentlyThanked.delete(author.id);
  }, 5000)
  if (recentlyThanked.get(author.id)) {
     console.log("Nah! it's too soon to thank him again");
  }
  console.log(recentlyThanked);

  setTimeout(() => {
    console.log(recentlyThanked.get(author.id))
  }, 6000)
}
main();
