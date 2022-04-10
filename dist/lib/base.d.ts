export declare const botCurrencyList: readonly ["JPY", "USD"];
export declare type botCurrency = typeof botCurrencyList[number];
export interface BaseBotParams {
    botID: string;
    baseCurrency: botCurrency;
    botLogic: string;
    botName: string;
}
export interface BaseBotResult {
    botID: string;
    baseCurrency: botCurrency;
    botLogic: string;
    botName: string;
    startTime: number;
    uuid: string;
}
export declare class BaseBotClass {
    private _uuid;
    private _id;
    private _name;
    private _logic;
    private _baseCurrency;
    private _startTime;
    constructor(baseParams: BaseBotParams);
    get uuid(): string;
    get id(): string;
    get botName(): string;
    get botLogic(): string;
    get baseCurrency(): botCurrency;
    get startTime(): number;
    get botResult(): BaseBotResult;
}
