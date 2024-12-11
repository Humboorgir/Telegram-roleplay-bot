import {
  replyToSomeoneLosingTheirObohat,
  replyToSomeoneRepeating,
} from "./dataset.json";
import userModel from "./models/userSchema";
import mongoose from 'mongoose';

export const chooseRandom = (arr: any[]) => {
    if (arr.length === 0) {
      throw new Error("chooseRandom HAS to be provided with an array of at least one element")
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }


// chat related utils 
export const literalReply = ((ctx, message: string) => {
   ctx.reply(message, {reply_parameters: { message_id: ctx.message.message_id }});
})

export const replyAfterReducedObohat = (ctx) => {
   ctx.reply(chooseRandom(replyToSomeoneLosingTheirObohat), {reply_parameters: { message_id: ctx.message.message_id }});
}

export const replyAfterRepeatedViolation = (ctx) => {
  ctx.reply(chooseRandom(replyToSomeoneRepeating), {reply_parameters: {message_id: ctx.message.message_id}});
}

// obohat related stuff 
export async function addUserToObohatMetric(user) {
  const storedUser = await userModel.findOne({ username: user.username });
  // already stored, no need to do anything
  if(storedUser) return;
  const data = new userModel({
    username: user.username,
    obohat: 100
  })
  await data.save();
}

export async function reduceObohat(user, amount) {
  const storedUser = await userModel.findOne({ username: user.username });
  const currentObohat = storedUser!.obohat;
  await storedUser!.updateOne({ obohat: currentObohat - amount });
}

export async function increaseObohat(user, amount) {
  const storedUser = await userModel.findOne({ username: user.username });
  const currentObohat = storedUser!.obohat;
  await storedUser!.updateOne({ obohat: currentObohat + amount });
}

export async function getListofObohat() {
  const storedUsers = await userModel.find({});
  return storedUsers.map(user => `@${user.username} : ${user.obohat}`).join("\n");
}
// mongodb related stuff
export function mongoConnect(): void {
    if (!process.env.MONGODB_URI) throw Error("[mongoConnect] Couldn't find process.env.MONGODB_URI");
    mongoose.connect(process.env.MONGODB_URI).then(() => console.log('[mongoConnect] Successfull connected to mongodb'));
}