import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import {
  literalReply,
  mongoConnect,
  getListofObohat,
  increaseObohat,
} from "./utils";
import messageHandler from "./events/message";

const bot = new Telegraf(process.env.BOT_TOKEN);
const recentlyLostObohat = new Set();

mongoConnect();

bot.hears("ابوهت", async (ctx) => {
  literalReply(ctx, await getListofObohat());
});

function handleThanks(ctx) {
  if(!ctx.message.reply_to_message?.from) return console.log("No reply");
  
  const userBeingThanked = ctx.message.reply_to_message?.from;
  
  if (userBeingThanked.username == ctx.message.from.username)
    return literalReply(ctx, "از خودت تشکر می کنی؟");
  if(userBeingThanked.is_bot) return;
  
  increaseObohat(userBeingThanked, 15);
  literalReply(ctx, `به ابوهت @${userBeingThanked.username} 15 تا اضافه شد!!`);
}

bot.hears("ممنون", handleThanks);
bot.hears("تشکر", handleThanks);
bot.hears("متشکرم", handleThanks);
bot.hears("دمت گرم", handleThanks);
bot.hears('ممنونم', handleThanks);
bot.hears("متشکرم", handleThanks)
bot.hears("دم شما گرم", handleThanks)

bot.on(message("text"), (ctx) => messageHandler(ctx, recentlyLostObohat));

bot.launch();
