import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.supplychain.food.model{
   export enum AssetStatus {
      LIVE,
      PROCESSED,
      CONSUMED,
   }
   export abstract class LiveAsset extends Asset {
      assetId: string;
      assetStatus: AssetStatus;
      aggregatedGHG: number;
      atState: SupplyChainState;
   }
   export abstract class Vegetables extends LiveAsset {
      amount: number;
   }
   export abstract class Animals extends LiveAsset {
      amount: number;
   }
   export class Cow extends Animals {
   }
   export class Steak extends Animals {
   }
   export class Address {
      country: string;
      city: string;
      street: string;
      hauseNr: number;
   }
   export abstract class SupplyChainState extends Participant {
      stateId: string;
      stateName: string;
      stateAddress: Address;
      GHG: number;
      stateFrom: SupplyChainState[];
   }
   export class Production extends SupplyChainState {
   }
   export class Processing extends SupplyChainState {
   }
   export class Distribution extends SupplyChainState {
   }
   export class Retail extends SupplyChainState {
   }
   export class Restaurant extends SupplyChainState {
   }
   export class InitTestData extends Transaction {
   }
   export class ClearData extends Transaction {
   }
   export class Process extends Transaction {
      liveAsset: LiveAsset;
      fromState: SupplyChainState;
      toState: SupplyChainState;
   }
   export class Produce extends Transaction {
      atProduction: Production;
   }
   export class Consume extends Transaction {
      liveAsset: LiveAsset;
      atRestaurant: Restaurant;
   }
   export class AssetProduced extends Event {
      liveAsset: LiveAsset;
      creationGHG: number;
   }
   export class AssetProcessed extends Event {
      liveAsset: LiveAsset;
      transferGHG: number;
   }
   export class AssetConsumed extends Event {
      liveAsset: LiveAsset;
      endGHG: number;
   }
// }
