import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import {
  literalReply,
  mongoConnect,
  getListofObohat
} from "./utils";
import messageHandler from "./events/message";

const bot = new Telegraf(process.env.BOT_TOKEN);
const recentlyLostObohat = new Set();

mongoConnect();

bot.hears("ابوهت", async (ctx) => {
  literalReply(ctx, await getListofObohat());
});

bot.on(message("text"), (ctx) => messageHandler(ctx, recentlyLostObohat));

bot.launch();