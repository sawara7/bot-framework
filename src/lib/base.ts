import { v4 as uuidv4 } from 'uuid'
import { SlackNotifier, getSlackNotifier } from 'slack-notification'

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
    notificationChannel?: string
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

export class BaseBotClass {
    private _uuid: string
    private _id: string
    private _name: string
    private _logic: string
    private _baseCurrency: botCurrency
    private _startTime: number
    private _notificationChannel?: string
    private _notifier?: SlackNotifier

    constructor(params: BaseBotParams) {
        this._uuid = uuidv4()
        this._startTime = Date.now()
        this._id = params.botID
        this._name = params.botName
        this._logic = params.botLogic
        this._baseCurrency = params.baseCurrency
        this._notificationChannel = params.notificationChannel
    }

    async Start() {
        if (this._notificationChannel) {
            this._notifier = await getSlackNotifier(this._notificationChannel)
        }
    }

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