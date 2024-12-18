import { getUserObohat, reduceObohat, literalReply } from '../utils';

export default async function handleSokoot(ctx) {
  // basic checks 
  if (!ctx.message.reply_to_message?.from) return;
  const userBeingSokooted = ctx.message.reply_to_message?.from;
  const author = ctx.message.from;
  if (userBeingSokooted.username == ctx.message.from.username) return;
  if (userBeingSokooted.is_bot) return;

  // actual code 
  const obohat = await getUserObohat(author);
  if(typeof obohat !== "number") return literalReply(ctx, 'فضلی اشتب زدی ربات ارور داد')
  const requiredObohat = 400;

  if(obohat < requiredObohat) return literalReply(ctx, `شما ابهت کاری برای انجام این کار را ندارید! ${requiredObohat - obohat} تا دیگه نیاز دارید.`)

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

  reduceObohat(author, 300);
  literalReply(ctx, `به @${userBeingSokooted.username} نیم ساعت سکوت دادم!!
  اما شما به دلیل سوء استفاده از قدرتتان مقدار زیادی از ابهتتان را از دست دادید.`)
}