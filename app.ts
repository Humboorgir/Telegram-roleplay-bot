import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import {
  literalReply,
  mongoConnect,
  getListofObohat,
  reduceObohat,
  chooseRandom,
  increaseObohat,
  addUserToObohatMetric,
  keepAlive
} from "./utils";
import leaderboardHandler from './commands/لیدربرد';
import obohatHandler from './commands/ابهت';
import sokootHandler from './commands/سکوت';
import mobarezeHandler from './commands/مبارزه';
import messageHandler from "./events/message";

const bot = new Telegraf(process.env.BOT_TOKEN);
const recentlyLostObohat = new Set();
const recentlyThanked = new Set();
let botRecentlyThanked = false;

mongoConnect();
keepAlive();

bot.hears("ابهت", obohatHandler);
bot.hears("لیدربرد", leaderboardHandler)

async function handleThanks(ctx) {
  const author = ctx.message.from;
  const userBeingThanked = ctx.message.reply_to_message?.from;
  if (!userBeingThanked) return;

  if (userBeingThanked.username == ctx.message.from.username)
    return literalReply(ctx, "از خودت تشکر می کنی؟");
  if (userBeingThanked.is_bot) return;

  if(botRecentlyThanked) { 
    ctx.restrictChatMember(author.id, {
      permissions: {
        can_send_messages: false,
        can_send_videos: false,
        can_send_other_messages: false,
        can_add_web_page_previews: false,
        can_send_voice_notes: false,
      },
    });

    setTimeout(() => {
      ctx.restrictChatMember(author.id, {
        permissions: {
          can_send_messages: true,
          can_send_videos: true,
          can_send_other_messages: true,
          can_add_web_page_previews: true,
          can_send_voice_notes: true,
        },
      });
    }, 1000 * 60)
    return literalReply(ctx, 'آرام باش برادر');
  }
  if(recentlyThanked.has(author.id)) return literalReply(ctx, 'همین الان تشکر کردی! نیم ساعت صبر کن')

  recentlyThanked.add(author.id);
  botRecentlyThanked = true;
  setTimeout(() => {
    botRecentlyThanked = false;
  }, 1000, 60)
  setTimeout(() => {
   recentlyThanked.delete(author.id);
  }, 1000 * 60 * 30)
                      
  await addUserToObohatMetric(userBeingThanked)
  await increaseObohat(userBeingThanked, 15);
  literalReply(ctx, `به ابهت @${userBeingThanked?.username} 15 تا اضافه شد!!`);
}

bot.hears("ممنون", handleThanks);
bot.hears("تشکر", handleThanks);
bot.hears("متشکرم", handleThanks);
bot.hears("دمت گرم", handleThanks);
bot.hears("ممنونم", handleThanks);
bot.hears("متشکرم", handleThanks);
bot.hears("دم شما گرم", handleThanks);

bot.hears("سکوت", sokootHandler);

bot.hears('مبارزه', mobarezeHandler);

bot.action(/fight (.+)/, (ctx,next) => {
  let challengerId = ctx.match[1] 
  return literalReply(ctx, 'تست')
})


bot.on(message("text"), (ctx) => messageHandler(ctx, recentlyLostObohat));

bot.launch({
  allowedUpdates: ['message', 'callback_query'],
});