import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const playlistState = atom({
  key: "playlistState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const defaultList = atom({
  key: "Id",
  default: "6vjh7HbGlTNEwy3nxj5rqj",
  effects_UNSTABLE: [persistAtom],
});
