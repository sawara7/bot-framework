import { BaseBotResult } from "./result";
import { BaseObjectClass, BaseObjectVariables } from "my-utils";
import { botCurrency } from "./types";
import { BaseBotParams } from "./params";
export interface BaseBotVariables extends BaseObjectVariables {
    _name: string;
    _logic: string;
    _baseCurrency: botCurrency;
    _startTime: number;
    _enabled: boolean;
}
export declare abstract class BaseBotClass extends BaseObjectClass {
    private _name;
    private _logic;
    private _baseCurrency;
    private _startTime;
    private _enabled;
    private _notifier?;
    protected _unrealizedProfit: number;
    protected _totalProfit: number;
    private _previousHourlyProfit;
    protected _hourlyProfit: number;
    private _onHourly?;
    constructor(params: BaseBotParams);
    import(j: any): void;
    export(): any;
    start(): Promise<void>;
    protected abstract calcTotalProfit(): number;
    protected abstract calcUnrealizedProfit(): number;
    private schedule;
    protected abstract doStart(): Promise<void>;
    stop(): Promise<void>;
    protected abstract doStop(): Promise<void>;
    get botName(): string;
    get botLogic(): string;
    get baseCurrency(): botCurrency;
    get startTime(): number;
    get enabled(): boolean;
    get totalProfit(): number;
    get hourlyProfit(): number;
    get unrealizedProfit(): number;
    protected notice(msg: string): void;
    get botResult(): BaseBotResult;
}
