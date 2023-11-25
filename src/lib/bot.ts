import { RealtimeDatabaseClass, getRealTimeDatabase } from "utils-firebase-server"
import { BaseBotParams } from "./params"
import { BaseBotResult } from "./types"

export class BotFrameClass {
    private _rdb: RealtimeDatabaseClass | undefined

    constructor(private _baseParams: BaseBotParams) {}

    async start(): Promise<void> {
        await this.initialize()
        while(true) {
            try {
                await this.update()
            } catch(e) {
                console.log(this._baseParams.botName, e)
            } finally {
                if (!this.isBackTest) console.log(this._baseParams.botName, new Date().toLocaleString())
            }
        }
    }

    protected async initialize(): Promise<void> {
        if (!this.isBackTest) this._rdb = await getRealTimeDatabase()
    }

    protected async update(): Promise<void> {
        if (!this.isBackTest) await this.setRealtimeDatabase()
    }
    
    private async setRealtimeDatabase(): Promise<void> {
        if (this._rdb) await this._rdb.set('bot/' + this._baseParams.botName, await this.getBotResult())
    }

    protected get isBackTest(): boolean {
        return this._baseParams.isBackTest? true: false
    }

    protected async getBotResult(): Promise<BaseBotResult> {
        return {
            updateTimestamp: Date.now().toString(),
            totalProfit: '0'
        }
    }
}