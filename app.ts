import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import {
  literalReply,
  mongoConnect,
  getListofObohat,
  reduceObohat,
  increaseObohat,
  addUserToObohatMetric,
} from "./utils";
import messageHandler from "./events/message";

const bot = new Telegraf(process.env.BOT_TOKEN);
const recentlyLostObohat = new Set();

mongoConnect();

bot.hears("ابوهت", async (ctx) => {
  const list = await getListofObohat(ctx);
  console.log(list)
  literalReply(ctx, list, true);
});

async function handleThanks(ctx) {
  if (!ctx.message.reply_to_message?.from) return;

  const userBeingThanked = ctx.message.reply_to_message?.from;

  if (userBeingThanked.username == ctx.message.from.username)
    return literalReply(ctx, "از خودت تشکر می کنی؟");
  if (userBeingThanked.is_bot) return;

  await addUserToObohatMetric(userBeingThanked)
  await increaseObohat(userBeingThanked, 15);
  literalReply(ctx, `به ابوهت @${userBeingThanked?.username} 15 تا اضافه شد!!`);
}

bot.hears("ممنون", handleThanks);
bot.hears("تشکر", handleThanks);
bot.hears("متشکرم", handleThanks);
bot.hears("دمت گرم", handleThanks);
bot.hears("ممنونم", handleThanks);
bot.hears("متشکرم", handleThanks);
bot.hears("دم شما گرم", handleThanks);

function handleSokoot(ctx) {
  if (!ctx.message.reply_to_message?.from) return;
  const userBeingSokooted = ctx.message.reply_to_message?.from;
  if (userBeingSokooted.username == ctx.message.from.username) return;
  if (userBeingSokooted.is_bot) return;

  if(ctx.message.from.username !== "iliyafazlollahi") return literalReply(ctx, "این دستور به صورت آزمایشی راه اندازی شده است و فعلا فقط آقای فضل اللهی اجازه استفاده از آن را دارد.")

  literalReply(ctx, "چشم عالیجناب");

  ctx.restrictChatMember(userBeingSokooted.id, {
    permissions: {
      can_send_messages: false,
      can_send_videos: false,
      can_send_other_messages: false,
      can_add_web_page_previews: false,
      can_send_voice_notes: false,
    },
  });

  setTimeout(() => {
    ctx.restrictChatMember(userBeingSokooted.id, {
      permissions: {
        can_send_messages: true,
        can_send_videos: true,
        can_send_other_messages: true,
        can_add_web_page_previews: true,
        can_send_voice_notes: true,
      },
    });
  }, 1000 * 60 * 30)

  reduceObohat(ctx.message.from.username, 50);
  literalReply(ctx, `به @${userBeingSokooted.username} نیم ساعت سکوت دادم!!
  اما شما به دلیل سوء استفاده از قدرتتان مقدار زیادی از ابهتتان را از دست دادید.`)
}

bot.hears("سکوت", handleSokoot);
bot.on(message("text"), (ctx) => messageHandler(ctx, recentlyLostObohat));

bot.launch();
