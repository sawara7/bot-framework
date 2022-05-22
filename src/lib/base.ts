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
        await this.doStart()
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