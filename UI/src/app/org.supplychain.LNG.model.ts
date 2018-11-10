import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.supplychain.LNG.model{
   export enum AssetStatus {
      CREATED,
      IN_PROCESS,
      READY,
   }
   export abstract class GHGcarrierAsset extends Asset {
      assetId: string;
      assetStatus: AssetStatus;
      aggregatedGHG: number;
      atState: GHGProductionState;
   }
   export abstract class PhisicalAsset extends GHGcarrierAsset {
      amount: number;
   }
   export abstract class LiquidAsset extends GHGcarrierAsset {
      amount: number;
   }
   export class LNG extends LiquidAsset {
   }
   export class Address {
      country: string;
      city: string;
      street: string;
      hauseNr: number;
   }
   export abstract class GHGProductionState extends Participant {
      stateId: string;
      stateName: string;
      address: Address;
      GHG: number;
      stateFrom: GHGProductionState[];
   }
   export class ProductionState extends GHGProductionState {
   }
   export class GasFieldState extends GHGProductionState {
   }
   export class LNGToPipelineState extends GHGProductionState {
   }
   export class InitTestData extends Transaction {
   }
   export class ClearData extends Transaction {
   }
   export class ChangeState extends Transaction {
      assetToTransfer: GHGcarrierAsset;
      fromState: GHGProductionState;
      toState: GHGProductionState;
   }
   export class Create extends Transaction {
      gasFieldState: GasFieldState;
   }
   export class ToPipieline extends Transaction {
      assetToPipeline: GHGcarrierAsset;
      pipeLineState: LNGToPipelineState;
   }
   export class AssetCreated extends Event {
      gHGcarrierAsset: GHGcarrierAsset;
      creationGHG: number;
   }
   export class AssetStateChanged extends Event {
      gHGcarrierAsset: GHGcarrierAsset;
      transferGHG: number;
   }
   export class AssetSentToPipeline extends Event {
      gHGcarrierAsset: GHGcarrierAsset;
      sellingGHG: number;
   }
// }
