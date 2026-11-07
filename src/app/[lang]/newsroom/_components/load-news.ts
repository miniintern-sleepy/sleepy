import "server-only";
import { getNewsList } from "@/lib/content";

export async function loadNewsroom() {
  return getNewsList();
}
