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

export const STARTING_BLOCK = 11722;

export const NOGAME_CONTRACT =
  "0x068d1d807519589dab441e970986e469ac565a4ce6d3c82faf0fdec4100aa760";

export const SEPOLIA_URL = "https://sepolia.starknet.a5a.ch";
export const MAINNET_URL = "https://mainnet.starknet.a5a.ch";

export enum Names {
  STEEL = 1,
  QUARTZ = 2,
  TRITIUM = 3,
  ENERGY_PLANT = 4,
  LAB = 5,
  DOCKYARD = 6,
  ENERGY_TECH = 7,
  DIGITAL = 8,
  BEAM_TECH = 9,
  ARMOUR = 10,
  ION = 11,
  PLASMA_TECH = 12,
  WEAPONS = 13,
  SHIELD = 14,
  SPACETIME = 15,
  COMBUSTION = 16,
  THRUST = 17,
  WARP = 18,
  CARRIER = 19,
  SCRAPER = 20,
  CELESTIA = 21,
  SPARROW = 22,
  FRIGATE = 23,
  ARMADE = 24,
  BLASTER = 25,
  BEAM = 26,
  ASTRAL = 27,
  PLASMA = 28,
}
