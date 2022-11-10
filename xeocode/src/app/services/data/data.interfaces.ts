export interface Record {
  data: Datum[];
}

export interface Datum {
  value: string;
  key: string;
  timestamp: number;
}