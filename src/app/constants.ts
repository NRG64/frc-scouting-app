export const AUTONOMOUS_DURATION = 15000; // 15
export const MATCH_DURATION = 135000; // 2:15

export const baseX = 168;
export const baseY = 215;

export const buttonConfigs = [
  { name: "A", top: baseY, left: baseX },
  { name: "B", top: baseY + 30, left: baseX },
  { name: "C", top: baseY + 65, left: baseX + 13 },
  { name: "D", top: baseY + 85, left: baseX + 40 },
  { name: "E", top: baseY + 85, left: baseX + 93 },
  { name: "F", top: baseY + 65, left: baseX + 120 },
  { name: "G", top: baseY + 30, left: baseX + 133 },
  { name: "H", top: baseY, left: baseX + 133 },
  { name: "I", top: baseY - 35, left: baseX + 120 },
  { name: "J", top: baseY - 55, left: baseX + 93 },
  { name: "K", top: baseY - 55, left: baseX + 40 },
  { name: "L", top: baseY - 35, left: baseX + 13 },
  { name: "HP 1", top: baseY - 170, left: 20 },
  { name: "HP 2", top: baseY + 200, left: 20 },
  { name: "processor", top: 455, left: 303 },
  { name: "Robot disabled", top: 200, left: 1050 },
  { name: "Robot enabled", top: 200, left: 900 },
  { name: "Defense played", top: 240, left: 900 },
  { name: "", top: baseY + 20, left: baseX + 38, type: "algae" },
  { name: "", top: baseY + 20, left: baseX + 100, type: "algae" },
  { name: "", top: baseY + 48, left: baseX + 52, type: "algae" },
  { name: "", top: baseY - 7, left: baseX + 52, type: "algae" },
  { name: "", top: baseY - 7, left: baseX + 85, type: "algae" },
  { name: "", top: baseY + 48, left: baseX + 85, type: "algae" },
];
