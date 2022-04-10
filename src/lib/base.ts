import { v4 as uuidv4 } from 'uuid'

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
}

export class BaseBotClass {
    private _uuid: string
    private _id: string
    private _name: string
    private _logic: string
    private _baseCurrency: botCurrency
    private _startTime: number

    constructor(baseParams: BaseBotParams) {
        this._uuid = uuidv4()
        this._startTime = Date.now()
        this._id = baseParams.botID
        this._name = baseParams.botName
        this._logic = baseParams.botLogic
        this._baseCurrency = baseParams.baseCurrency
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

    get baseCurrency(): string {
        return this._baseCurrency
    }

    get startTime(): number {
        return this._startTime
    }
}