import { literalReply, chooseRandom } from '../utils';
import { Telegraf, Markup } from "telegraf";

export default async function handler(ctx) {
  // in the testing stage, not finished yet 
  const userBeingChallenged = ctx.message.reply_to_message?.from;
  const challenger = ctx.message.from;
  if(!userBeingChallenged) return literalReply(ctx, "مارو اسکل کردی؟ با کی میخوای مبارزه کنی")

  console.log(`user being challenged:`)
  console.log(userBeingChallenged)
  
  let sendKeyboard = Markup.inlineKeyboard([Markup.button.callback('⚔️ بزن بریم', `fight ${userBeingChallenged.id}`)])

  ctx.reply(`برادر ${userBeingChallenged.first_name} می خوای با ایشون مبارزه کنی؟`, sendKeyboard);
  
  // const winner = chooseRandom([challenger.id, userBeingChallenged.id]);
  // if(winner == challenger.id) {
  //   return literalReply(ctx, `شما ${userBeingChallenged.first_name} را `)
  // }
  
}