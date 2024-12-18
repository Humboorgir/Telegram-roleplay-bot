import {
  replyToSomeoneLosingTheirObohat,
  replyToSomeoneRepeating,
} from "./dataset.json";
import userModel from "./models/userSchema";
import mongoose from 'mongoose';
import express from 'express';

export const chooseRandom = (arr: any[]) => {
    if (arr.length === 0) {
      throw new Error("chooseRandom HAS to be provided with an array of at least one element")
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }


// chat related utils 
export const literalReply = (async (ctx, message: string, isMarkdown = false) => {
  console.log("doing a literal reply")
  try {
   await ctx.reply(message, { parse_mode: isMarkdown ? "MarkdownV2" : "" ,reply_parameters: { message_id: ctx.message.message_id }});
  } catch (e) { console.log(`Caught an error:\n`+ JSON.stringify(e))}
})

export const replyAfterReducedObohat = async (ctx) => {
  literalReply(ctx, chooseRandom(replyToSomeoneLosingTheirObohat));
}

export const replyAfterRepeatedViolation = async (ctx) => {
  literalReply(ctx, chooseRandom(replyToSomeoneRepeating))
}

// obohat related stuff 
export async function addUserToObohatMetric(user) {
  const storedUser = await userModel.findOne({ id: user.id });
  // already stored, no need to do anything
  if(storedUser) return;

  console.log(`adding ${user.username} to users`)
  const data = new userModel({
    id: user.id,
    obohat: 100
  })
  await data.save();
}

export async function reduceObohat(user, amount) {
  const storedUser = await userModel.findOne({ id: user.id });
  const currentObohat = storedUser!.obohat;
  await storedUser!.updateOne({ obohat: currentObohat - amount });
}

export async function increaseObohat(user, amount) {
  const storedUser = await userModel.findOne({ id: user.id });
  const currentObohat = storedUser!.obohat;
  await storedUser!.updateOne({ obohat: currentObohat + amount });
}

export async function getUserObohat(user) {
  await addUserToObohatMetric(user);
  const storedUser = await userModel.findOne({ id: user.id });
  if(!storedUser) return 'فضلی ریدی ربات ارور داد پرامس رو اشتباه نوشتی'
  return storedUser!.obohat;
}

export async function getListofObohat(ctx) {
  const storedUsers = await userModel.find({});
  const list = await Promise.all(storedUsers.map(async (user) => {
    const member = await ctx.getChatMember(user.id);
    if(!member) console.log(`ERROR! Member with the id ${user.id} cannot be found`)
    const firstName = member.user.first_name;
    return `[${firstName.replace(/\_/g, '\\_')
             .replace(/\*/g, '\\*')
             .replace(/\[/g, '\\[')
             .replace(/\]/g, '\\]')
             .replace(/\(/g, '\\(')
             .replace(/\)/g, '\\)')
             .replace(/\~/g, '\\~')
             .replace(/\`/g, '\\`')
             .replace(/\>/g, '\\>')
             .replace(/\#/g, '\\#')
             .replace(/\+/g, '\\+')
             .replace(/\-/g, '\\-')
             .replace(/\=/g, '\\=')
             .replace(/\|/g, '\\|')
             .replace(/\{/g, '\\{')
             .replace(/\}/g, '\\}')
             .replace(/\./g, '\\.')
             .replace(/\!/g, '\\!')}](tg://user?id=${user.id}) : ${user.obohat}`
  }));

  return (list.join("\n"))
}
// mongodb related stuff
export function mongoConnect(): void {
    if (!process.env.MONGODB_URI) throw Error("[mongoConnect] Couldn't find process.env.MONGODB_URI");
    mongoose.connect(process.env.MONGODB_URI).then(() => console.log('[mongoConnect] Successfull connected to mongodb'));
}

// express 
export function keepAlive() {
  const app = express()
  const port = process.env.PORT || 3000

  app.all('/', (req, res) => {
    res.send('Hello!')
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}