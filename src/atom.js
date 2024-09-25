import { atom } from "recoil";

export const timerState = atom({
  key: "timerState",
  default: {
    minutes: 30,
    seconds: 0,
  },
});

export const isRunningState = atom({
  key: "isRunningState",
  default: false,
});

export const roundState = atom({
  key: "roundState",
  default: {
    current: 0,
    total: 4,
    shouldIncrementGoal: false,
  },
});

export const goalState = atom({
  key: "goalState",
  default: {
    current: 0,
    total: 12,
  },
});
