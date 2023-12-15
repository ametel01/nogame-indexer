import { hash } from "./deps.ts";

export function formatFelt(key: bigint): string {
  return "0x" + key.toString(16);
}

export const SELECTOR_KEYS = {
  COMPOUNDS: BigInt(hash.getSelectorFromName("CompoundSpent")),
  TECHS: BigInt(hash.getSelectorFromName("TechSpent")),
  FLEET: BigInt(hash.getSelectorFromName("FleetSpent")),
  DEFENCES: BigInt(hash.getSelectorFromName("DefenceSpent")),
  PLANET: BigInt(hash.getSelectorFromName("PlanetGenerated")),
  BATTLE: BigInt(hash.getSelectorFromName("BattleReport")),
};

export const STARTING_BLOCK = 917881;

export const NOGAME_CONTRACT =
  "0x00c2698a7a63b35b0cf7e8fbb8ac59ffcccdafec2fad81712e209682059a4bd9";

export const GOERLI_URL = "https://goerli.starknet.a5a.ch";
