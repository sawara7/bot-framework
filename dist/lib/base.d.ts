export declare const botCurrencyList: readonly ["JPY", "USD"];
export declare type botCurrency = typeof botCurrencyList[number];
export interface BaseBotParams {
    botID: string;
    baseCurrency: botCurrency;
    botLogic: string;
    botName: string;
    notificationChannel?: string;
}
export interface BaseBotResult {
    time: number;
    botID: string;
    baseCurrency: botCurrency;
    botLogic: string;
    botName: string;
    startTime: number;
    uuid: string;
}
export declare abstract class BaseBotClass {
    private _uuid;
    private _id;
    private _name;
    private _logic;
    private _baseCurrency;
    private _startTime;
    private _notificationChannel?;
    private _notifier?;
    private _enabled;
    constructor(params: BaseBotParams);
    start(): Promise<void>;
    protected abstract doStart(): Promise<void>;
    stop(): Promise<void>;
    protected abstract doStop(): Promise<void>;
    get uuid(): string;
    get id(): string;
    get botName(): string;
    get botLogic(): string;
    get baseCurrency(): botCurrency;
    get startTime(): number;
    get enabled(): boolean;
    protected notice(msg: string): void;
    get botResult(): BaseBotResult;
}
