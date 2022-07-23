import { schedule } from "node-cron"
import { BaseBotResult } from "./result"
import { BaseObjectClass, BaseObjectVariables } from "my-utils"
import { botCurrency } from "./types"
import { BaseBotParams } from "./params"

export interface BaseBotVariables extends BaseObjectVariables{
    _name: string
    _logic: string
    _baseCurrency: botCurrency
    _startTime: number
    _enabled: boolean
}

export abstract class BaseBotClass extends BaseObjectClass {
    private _name: string
    private _logic: string
    private _baseCurrency: botCurrency
    private _startTime: number
    private _enabled: boolean = false
    private _notifier?: (msg: string) => void

    protected _unrealizedProfit: number = 0
    protected _totalProfit: number = 0
    private _previousHourlyProfit: number = 0
    protected _hourlyProfit: number = 0
    private _onHourly?: (bot: BaseBotClass) => void

    constructor(params: BaseBotParams) {
        super()
        this._startTime = Date.now()
        this._name = params.botName
        this._logic = params.botLogic
        this._baseCurrency = params.baseCurrency
        this._notifier = params.notifier
        this._onHourly = params.onHourly
    }

    public import(j: any) {
        super.import(j)
        const v = j as BaseBotVariables
        this._name = v._name
        this._logic = v._logic
        this._baseCurrency = v._baseCurrency
        this._startTime = v._startTime
        this._enabled = v._enabled
    }

    public export(): any {
        const v = super.export() as BaseBotVariables
        v._startTime = this._startTime
        v._name = this._name
        v._logic = this._logic
        v._baseCurrency = this._baseCurrency
        return v
    }

    public async start(): Promise<void> {
        if (this._enabled) {
            throw new Error('start failed.')
        }
        this._enabled = true
        this.notice("Start: " + this.botName)
        this.schedule()
        await this.doStart()
    }

    protected abstract calcTotalProfit(): number
    protected abstract calcUnrealizedProfit(): number

    private schedule() {
        // hourly
        schedule('59 * * * *', async () => {
            this._totalProfit = this.calcTotalProfit()
            this._unrealizedProfit = this.calcUnrealizedProfit()
            this._hourlyProfit = this._totalProfit - this._previousHourlyProfit
            if (this._onHourly) {
                await this._onHourly(this)
            }
            this._previousHourlyProfit = this._totalProfit
        })
    }

    protected abstract doStart(): Promise<void>

    public async stop(): Promise<void> {
        if (!this._enabled) {
            this.notice("Stop failed")
            throw new Error('stop failed.')
        } 
        this._enabled = false
        await this.doStop()
        this.notice("Stop: " + this.botName)
    }

    protected abstract doStop(): Promise<void>

    get botName(): string {
        return this._name
    }

    get botLogic(): string {
        return this._logic
    }

    get baseCurrency(): botCurrency {
        return this._baseCurrency
    }

    get startTime(): number {
        return this._startTime
    }

    get enabled(): boolean {
        return this._enabled
    }

    get totalProfit(): number {
        return this._totalProfit
    }

    get hourlyProfit(): number {
        return this._hourlyProfit
    }

    get unrealizedProfit(): number {
        return this._unrealizedProfit
    }

    protected notice(msg: string) {
        if (this._notifier) {
            this._notifier(msg)
        }
    }

    get botResult(): BaseBotResult {
        return {
            time: Date.now(),
            botID: this.uuid,
            baseCurrency: this.baseCurrency,
            botLogic: this.botLogic,
            botName: this.botName,
            startTime: this.startTime,
            uuid: this.uuid,
            totalProfit: this.totalProfit,
            hourlyProfit: this.hourlyProfit,
            unrealizedProfit: this.unrealizedProfit
        }
    }
}