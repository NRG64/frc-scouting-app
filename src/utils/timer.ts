import { AUTONOMOUS_DURATION, MATCH_DURATION } from "@/app/constants";

export function formatTimeDisplay(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const ms = Math.floor((milliseconds % 1000) / 10);

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}:${ms.toString().padStart(2, "0")}`;
}

export function isAutonomousPeriodEnded(time: number): boolean {
  return time >= AUTONOMOUS_DURATION && time < AUTONOMOUS_DURATION + 100;
}

export function isMatchEnded(time: number): boolean {
  return time >= MATCH_DURATION;
}
