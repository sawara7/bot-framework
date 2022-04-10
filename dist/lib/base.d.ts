export declare const botCurrencyList: readonly ["JPY", "USD"];
export declare type botCurrency = typeof botCurrencyList[number];
export interface BaseBotParams {
    botID: string;
    baseCurrency: botCurrency;
    botLogic: string;
    botName: string;
}
export declare class BaseBotClass {
    private _uuid;
    private _id;
    private _name;
    private _logic;
    private _baseCurrency;
    private _startTime;
    constructor(baseParams: BaseBotParams);
    get id(): string;
    get botName(): string;
    get botLogic(): string;
    get baseCurrency(): string;
    get startTime(): number;
}
