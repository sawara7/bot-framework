import {
    MongodbManagerClass
} from "utils-mongodb"
import {
    BaseBotParams
} from "./types"
import {
    sleep
} from "utils-general"
import {
    Ticker,
    getDefaultTicker,
    BaseBotStatus,
    getBaseBotStatus,
    MONGODB_DB_BOTSTATUS,
    MONGODB_TABLE_BOTSTATUS
} from "utils-trade"

export abstract class BotFrameClass {
    // private _realtimeDB: RealtimeDatabaseClass | undefined
    private _mongoDB: MongodbManagerClass | undefined
    private _botStatus: BaseBotStatus = getBaseBotStatus()
    private _previousTicker: Ticker = getDefaultTicker()
    private _currentTicker: Ticker = getDefaultTicker()

    constructor(private _baseParams: BaseBotParams) {
    }

    async execute(): Promise<void> {
        if (this.isBackTest || await this.getBotStatusAndIsContinue()) {
            try {
                if (!this.isBackTest && await this.isStopOrClearPosition()) return
                await this.updateBadget()
                this._previousTicker = this._currentTicker
                await this.updateTicker()
                await this.updateTrade()
                if (!this.isBackTest) {
                    this._botStatus.message = 'Normal.'
                    this._botStatus.lastDate = Date.now()
                    this._botStatus.dbName = this._baseParams.mongoDbName
                    await this.saveBotStatus()
                }
            } catch(e) {
                const err = e as Error
                console.log(this._baseParams.botName, err.name, err.message)
                this._botStatus.message = err.name + '/' + err.message
                await this.saveBotStatus()
            } finally {
                await sleep(this._baseParams.interval)
                if (!this.isBackTest) console.log(this._baseParams.botName, new Date().toLocaleString())
            }
        }
    }

    async initialize(): Promise<void> {
        this._botStatus.botName = this._baseParams.botName
        if (!this.isBackTest) {
            this._mongoDB = new MongodbManagerClass(
                MONGODB_DB_BOTSTATUS,
                this._baseParams.db)
            await this._mongoDB.connect()
        }

        if (!this.isBackTest) {
            await this.loadBotStatus(true)
        }

        await this.updateTicker()
    }

    private async isStopOrClearPosition(): Promise<boolean> {
        if (this._botStatus.isStop) {
            this._botStatus.message = 'Stopping...'
            await this.saveBotStatus()
            await sleep(1000)
            return true
        }
        if (this._botStatus.isClear) {
            await this.clearPosition()
            this._botStatus.isClear = false
            this._botStatus.isStop = true
            this._botStatus.message = 'Position cleared.'
            await this.saveBotStatus()
            await sleep(1000)
            return true    
        }
        return false
    }

    private async getBotStatusAndIsContinue(): Promise<boolean> {
        await this.loadBotStatus()
        return !this._botStatus.isExit
    }

    private async loadBotStatus(initialized?: boolean): Promise<void> {
        const res = await this.loadFromMongoDB(
            MONGODB_TABLE_BOTSTATUS,
            {botName: this._baseParams.botName}
            )
        console.log(res)
        if (res == null || (Array.isArray(res) && res.length === 0)) {
            if (initialized) {
                await this.saveBotStatus()
                return
            }
            throw new Error('failed load botStatus')
        }
        this._botStatus = res[0] as BaseBotStatus
    }

    private async saveBotStatus(): Promise<void> {
        await this.saveToMongoDBUpsert(
            MONGODB_TABLE_BOTSTATUS,
            this._botStatus,
            {botName: this._baseParams.botName}
            )
    }

    protected async loadFromMongoDB(path: string, filter?:any): Promise<any> {
        if (!this.isBackTest && this.mongoDB) {
            const res = await this.mongoDB.find(path, filter)
            if (res.result) return res.data
        }        
    }

    protected async saveToMongoDBUpsert(path: string, data: any, filter: any = {}): Promise<void> {
        if (!this.isBackTest && this.mongoDB) {
            await this.mongoDB.upsert(path, filter, data)
        }
    }

    protected async saveToMongoDBInsert(path: string, data: any, filter?: any): Promise<void> {
        if (!this.isBackTest && this.mongoDB) {
            await this.mongoDB.insert(path, data)
        }
    }

    abstract clearPosition(): Promise<void>

    protected abstract updateTicker(): Promise<void>

    protected abstract updateBadget(): Promise<void> 

    protected abstract updateTrade(): Promise<void>

    protected get isBackTest(): boolean {
        return this._baseParams.isBackTest? true: false
    }

    protected get currentTicker(): Ticker {
        return this._currentTicker
    }

    protected set currentTicker(tk: Ticker) {
        this._currentTicker = tk
    }

    protected get previousTicker(): Ticker {
        return this._previousTicker
    }

    protected get mongoDB(): MongodbManagerClass {
        if (!this._mongoDB) throw new Error('no mongoDB.')
        return this._mongoDB
    }
}