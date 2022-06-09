import { SlackNotifier } from 'slack-notification';
export declare const botCurrencyList: readonly ["JPY", "USD"];
export declare type botCurrency = typeof botCurrencyList[number];
export interface BaseBotParams {
    botID: string;
    baseCurrency: botCurrency;
    botLogic: string;
    botName: string;
    notifier?: SlackNotifier;
    onHourly?: (bot: BaseBotClass) => void;
    onDaily?: (bot: BaseBotClass) => void;
    onWeekly?: (bot: BaseBotClass) => void;
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
    private _notifier?;
    private _enabled;
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
    private schedule;
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
    get totalProfit(): number;
    get hourlyProfit(): number;
    get dailyProfit(): number;
    get weeklyProfit(): number;
    protected notice(msg: string): void;
    get botResult(): BaseBotResult;
}
