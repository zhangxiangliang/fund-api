import auto from "./auto";
import tencent from "./tencent";
import type { FundProviderName } from "../types/funds";

const sourceNames: FundProviderName[] = ["tencent"];

export function getSources(): FundProviderName[] {
  return [...sourceNames];
}

export { auto, tencent };
export type {
  Fund,
  FundNavHistoryItem,
  FundProviderName,
  FundSearchResult,
} from "../types/funds";

export default {
  auto,
  getSources,
  tencent,
};
