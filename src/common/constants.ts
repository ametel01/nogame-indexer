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
  "0x055f947ca6e646dbc29e2501e6ece87a1bf772fa5be418364ec6e0104a03cb26";

export const GOERLI_URL = "https://goerli.starknet.a5a.ch";
