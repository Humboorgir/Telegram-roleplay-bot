import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import {
  literalReply,
  mongoConnect,
  getListofObohat,
  reduceObohat,
  increaseObohat,
  addUserToObohatMetric,
  keepAlive
} from "./utils";
import leaderboardHandler from './commands/لیدربرد';
import obohatHandler from './commands/ابهت';
import sokootHandler from './commands/سکوت';
import messageHandler from "./events/message";

const bot = new Telegraf(process.env.BOT_TOKEN);
const recentlyLostObohat = new Set();

mongoConnect();
keepAlive();

bot.hears("ابهت", obohatHandler);
bot.hears("لیدربرد", leaderboardHandler)

async function handleThanks(ctx) {
  if (!ctx.message.reply_to_message?.from) return;

  const userBeingThanked = ctx.message.reply_to_message?.from;

  if (userBeingThanked.username == ctx.message.from.username)
    return literalReply(ctx, "از خودت تشکر می کنی؟");
  if (userBeingThanked.is_bot) return;

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
bot.on(message("text"), (ctx) => messageHandler(ctx, recentlyLostObohat));

bot.launch();
