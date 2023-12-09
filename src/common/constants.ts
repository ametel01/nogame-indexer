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

export const NOGAME_CONTRACT =
  "0x064398e034e6250f75a72866dcd75689d355664c91a33a45749013a84159f491";

export const GOERLI_URL = "https://goerli.starknet.a5a.ch";
