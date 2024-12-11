import {
  replyAfterReducedObohat,
  replyAfterRepeatedViolation,
  addUserToObohatMetric,
  reduceObohat,
} from "../utils";
import { blacklistedWords } from "../dataset.json";

export default function messageHandler(
  ctx,
  recentlyLostObohat,
) {
  const author = ctx.message.from;
  const message = ctx.message.text;
  let messageContainsBlacklistedWords = false;

  addUserToObohatMetric(author);

  message.split(" ").forEach((word) => {
    if (!blacklistedWords.includes(word)) return;
    reduceObohat(author, 5);
    messageContainsBlacklistedWords = true;
  });

  if (messageContainsBlacklistedWords) {
    if (recentlyLostObohat.has(author.username)) {
      return replyAfterRepeatedViolation(ctx);
    }
    recentlyLostObohat.add(author.username);
    setTimeout(function () {
      recentlyLostObohat.delete(author.username);
    }, 10000);

    replyAfterReducedObohat(ctx);
  }
}
