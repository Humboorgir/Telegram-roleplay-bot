import { getUserObohat, literalReply } from '../utils';

export default async function handler(ctx) {
  const status = ['عقب مانده', 'نوب سگ', "بچه آدم", "خفن", "خیلی خفن", "فوقالعاده خفن"]
  const obohat = await getUserObohat(ctx.message.from);
  if(typeof obohat !== "number") return literalReply(ctx, obohat);
  let userStatus;
  if (obohat < 50) userStatus = status[0];
  else if (obohat >= 50 && obohat < 100) userStatus = status[1];
  else if (obohat >= 100 && obohat < 150) userStatus = status[2];
  else if (obohat >= 150 && obohat < 200) userStatus = status[3];
  else if (obohat >= 200 && obohat < 250) userStatus = status[4];
  else if (obohat >= 250 && obohat < 300) userStatus = status[5];
  literalReply(ctx, `ابهت شما: **${obohat}**\n شما **${userStatus}** هستید`, true);
}