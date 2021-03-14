export interface RatesapiResponse {
    base?:  string;
    rates?: { [key: string]: number };
    date?:  Date;
    error?: string;
}
