import { schedule } from "node-cron"
import { v4 as uuidv4 } from 'uuid'
import { SlackNotifier } from 'slack-notification'

export const botCurrencyList = [
    'JPY',
    'USD'
    ] as const;
export type botCurrency = typeof botCurrencyList[number];

export interface BaseBotParams {
    botID: string
    baseCurrency: botCurrency
    botLogic: string
    botName: string
    notifier?: SlackNotifier
    onHourly?: (bot: BaseBotClass) => void
    onDaily?: (bot: BaseBotClass) => void
    onWeekly?: (bot: BaseBotClass) => void
}

export interface BaseBotResult {
    time: number
    botID: string
    baseCurrency: botCurrency
    botLogic: string
    botName: string
    startTime: number
    uuid: string
}

export abstract class BaseBotClass {
    private _uuid: string
    private _id: string
    private _name: string
    private _logic: string
    private _baseCurrency: botCurrency
    private _startTime: number
    private _notifier?: SlackNotifier
    private _enabled: boolean = false

    protected _totalProfit: number = 0
    private _previousHourlyProfit: number = 0
    protected _hourlyProfit: number = 0
    private _onHourly?: (bot: BaseBotClass) => void
    private _previousDailyProfit: number = 0
    protected _dailyProfit: number = 0
    private _onDaily?: (bot: BaseBotClass) => void
    private _previousWeeklyProfit: number = 0
    protected _weeklyProfit: number = 0
    private _onWeekly?: (bot: BaseBotClass) => void

    constructor(params: BaseBotParams) {
        this._uuid = uuidv4()
        this._startTime = Date.now()
        this._id = params.botID
        this._name = params.botName
        this._logic = params.botLogic
        this._baseCurrency = params.baseCurrency
        this._notifier = params.notifier
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

    private schedule() {
        // hourly
        schedule('59 * * * *', async () => {
            this._hourlyProfit = this._totalProfit - this._previousHourlyProfit
            if (this._onHourly) {
                await this._onHourly(this)
            }
            this._previousHourlyProfit = this._totalProfit
            this._hourlyProfit = 0
        })

        // daily
        schedule('59 23 * * *', async () => {
            this._dailyProfit = this._totalProfit - this._previousDailyProfit
            if (this._onDaily) {
                await this._onDaily(this)
            }
            this._previousDailyProfit = this._totalProfit
            this._dailyProfit = 0
        })

        // weekly
        schedule('59 23 * * 6', async () => {
            this._weeklyProfit = this._totalProfit - this._previousWeeklyProfit
            if (this._onWeekly) {
                await this._onWeekly(this)
            }
            this._previousWeeklyProfit = this._totalProfit
            this._weeklyProfit = 0
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

    get uuid(): string {
        return this._uuid
    }

    get id(): string {
        return this._id
    }

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

    get hourlyProfit(): number {
        return this._hourlyProfit
    }

    get dailyProfit(): number {
        return this._dailyProfit
    }

    get weeklyProfit(): number {
        return this._weeklyProfit
    }

    protected notice(msg: string) {
        if (this._notifier) {
            this._notifier.sendMessage(msg)
        }
    }

    get botResult(): BaseBotResult {
        return {
            time: Date.now(),
            botID: this.id,
            baseCurrency: this.baseCurrency,
            botLogic: this.botLogic,
            botName: this.botName,
            startTime: this.startTime,
            uuid: this.uuid
        }
    }
}