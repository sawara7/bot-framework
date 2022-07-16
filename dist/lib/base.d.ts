import { BaseBotResult } from "./result";
import { UUIDInstanceClass } from "my-utils";
export declare const botCurrencyList: readonly ["JPY", "USD"];
export declare type botCurrency = typeof botCurrencyList[number];
export interface BaseBotParams {
    botID: string;
    baseCurrency: botCurrency;
    botLogic: string;
    botName: string;
    notifier?: (msg: string) => void;
    onHourly?: (bot: BaseBotClass) => void;
    onDaily?: (bot: BaseBotClass) => void;
    onWeekly?: (bot: BaseBotClass) => void;
}
export declare abstract class BaseBotClass extends UUIDInstanceClass {
    private _id;
    private _name;
    private _logic;
    private _baseCurrency;
    private _startTime;
    private _notifier?;
    private _enabled;
    protected _unrealizedProfit: number;
    protected _totalProfit: number;
    private _previousHourlyProfit;
    protected _hourlyProfit: number;
    private _onHourly?;
    private _previousDailyProfit;
    protected _dailyProfit: number;
    private _onDaily?;
    private _previousWeeklyProfit;
    protected _weeklyProfit: number;
    private _onWeekly?;
    constructor(params: BaseBotParams);
    start(): Promise<void>;
    protected abstract calcTotalProfit(): number;
    protected abstract calcUnrealizedProfit(): number;
    private schedule;
    protected abstract doStart(): Promise<void>;
    stop(): Promise<void>;
    protected abstract doStop(): Promise<void>;
    get id(): string;
    get botName(): string;
    get botLogic(): string;
    get baseCurrency(): botCurrency;
    get startTime(): number;
    get enabled(): boolean;
    get totalProfit(): number;
    get hourlyProfit(): number;
    get dailyProfit(): number;
    get weeklyProfit(): number;
    get unrealizedProfit(): number;
    protected notice(msg: string): void;
    get botResult(): BaseBotResult;
}
