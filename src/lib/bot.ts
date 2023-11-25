import { RealtimeDatabaseClass, getRealTimeDatabase } from "utils-firebase-server"
import { BaseBotParams } from "./params"
import { BaseBotResult } from "./types"

export class BotFrameClass {
    private _rdb: RealtimeDatabaseClass | undefined
    private _result: BaseBotResult

    constructor(private _params: BaseBotParams) {
        this._result = {
            updateTimestamp: Date.now().toString(),
            totalProfit: '0'
        }
    }

    async initialize(): Promise<void> {
        this._rdb = await getRealTimeDatabase()
    }

    async start(): Promise<void> {
        await this.initialize()
        while(true) {
            try {
                await this.update()
            } catch(e) {
                console.log(this._params.botName, e)
            } finally {
                console.log(this._params.botName, new Date().toLocaleString())
            }
        }
    }

    async update(): Promise<void> {
        await this.setRealtimeDatabase()
    }
    
    async setRealtimeDatabase(): Promise<void> {
        if (this._rdb) await this._rdb.set('bot/' + this._params.botName, this._result)
    }
}