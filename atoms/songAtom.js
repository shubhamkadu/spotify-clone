import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const currentTrackIdState = atom({
  key: "currentTrackIdState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const isPlayingState = atom({
  key: "isPlayingState",
  default: false,
  effects_UNSTABLE: [persistAtom],
});
