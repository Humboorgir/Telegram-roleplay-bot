import { getListofObohat, literalReply } from '../utils';

export default async function handler(ctx) {
  const list = await getListofObohat(ctx);
  literalReply(ctx, list, true);
}