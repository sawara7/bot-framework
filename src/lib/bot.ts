import { RealtimeDatabaseClass, getRealTimeDatabase } from "utils-firebase-server"
import { BaseBotParams } from "./params"
import { BaseBotResult } from "./types"
import { sleep } from "utils-general"

export interface BotStatus {
    isClaer: boolean
    isStop: boolean
}

export class BotFrameClass {
    private _rdb: RealtimeDatabaseClass | undefined
    private _totalProfit: number = 0

    constructor(private _baseParams: BaseBotParams) {}

    async start(): Promise<void> {
        await this.initialize()
        while(true) {
            try {
                if (!this._rdb) return
                const botStatus = await this._rdb.get(await this._rdb.getReference("botStatus/" + this._baseParams.botName)) as BotStatus
                console.log(botStatus)
                if (botStatus.isStop) {
                    console.log("stop")
                    await sleep(1000)
                    continue
                }
                console.log("before clear", botStatus.isClaer, botStatus.isClaer === true)
                if (botStatus.isClaer) {
                    console.log("clear")
                    await this.clearPosition()
                    await this._rdb.set("botStatus/" + this._baseParams.botName + "/isClear", false)
                    await sleep(1000)
                    continue    
                }
                await this.update()
            } catch(e) {
                console.log(this._baseParams.botName, e)
            } finally {
                if (!this.isBackTest) console.log(this._baseParams.botName, new Date().toLocaleString())
            }
        }
    }

    async initialize(): Promise<void> {
        if (!this.isBackTest) this._rdb = await getRealTimeDatabase()
    }

    async clearPosition(): Promise<void> {
    }

    async update(): Promise<void> {
        if (!this.isBackTest) await this.setRealtimeDatabase()
    }
    
    private async setRealtimeDatabase(): Promise<void> {
        if (this._rdb) await this._rdb.set('bot/' + this._baseParams.botName, await this.getBotResult())
    }

    protected get isBackTest(): boolean {
        return this._baseParams.isBackTest? true: false
    }

    protected get totalProfit(): number {
        return this._totalProfit
    }

    protected set totalProfit(value: number) {
        this._totalProfit = value
    }

    protected async getBotResult(): Promise<BaseBotResult> {
        return {
            botName: this._baseParams.botName,
            logicName: this._baseParams.logicName,
            updateTimestamp: new Date().toLocaleString(),
            totalProfit: this.totalProfit.toString()
        }
    }
}