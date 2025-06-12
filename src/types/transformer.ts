export interface VoltageReading {
  timestamp: string;
  voltage: string;
}

export interface Transformer {
  assetId: number;
  name: string;
  region: string;
  health: string;
  lastTenVoltgageReadings: VoltageReading[];
}

export interface TransformerState {
  transformers: Transformer[];
  selectedTransformers: number[];
  searchTerm: string;
  regionFilter: string;
}
