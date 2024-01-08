import { RealtimeDatabaseClass, getRealTimeDatabase } from "utils-firebase-server"
import { MongodbManagerClass } from "utils-mongodb"
import { Ticker, getDefaultTicker } from "utils-trade"
import { BaseBotParams, BaseBotResult, BaseBotStatus, MONGO_PATH_BOTRESULT, MONGO_PATH_BOTSTATUS, getBaseBotResult, getBaseBotStatus } from "./types"
import { sleep } from "utils-general"

export abstract class BotFrameClass {
    private _realtimeDB: RealtimeDatabaseClass | undefined
    private _mongoDB: MongodbManagerClass | undefined
    private _botStatus: BaseBotStatus = getBaseBotStatus()
    private _botResult: BaseBotResult = getBaseBotResult()
    private _previousTicker: Ticker = getDefaultTicker()
    private _currentTicker: Ticker = getDefaultTicker()

    constructor(private _baseParams: BaseBotParams) {
        this._botResult.botName = this._baseParams.botName
        this._botResult.logicName = this._baseParams.logicName
    }

    async start(): Promise<void> {
        await this.initialize()
        while(this.isBackTest || await this.getBotStatusFromRealtimeDbAndIsContinue()) {
            try {
                if (!this.isBackTest && await this.isStopOrClearPosition()) continue
                await this.updateBadget()
                await this.updateTicker()
                this._previousTicker = this._currentTicker
                await this.updateTrade()
                if (!this.isBackTest) {
                    this._botStatus.message = 'Normal.'
                    await this.saveBotStatus()
                    await this.saveBotResult()
                }
            } catch(e) {
                const err = e as Error
                console.log(this._baseParams.botName, err.name, err.message)
                this._botStatus = {
                    isClear: false,
                    isStop: true,
                    isExit: false,
                    message: err.name + '/' + err.message
                }
                await this.saveBotStatus()
            } finally {
                if (!this.isBackTest) console.log(this._baseParams.botName, new Date().toLocaleString())
            }
        }
    }

    protected async initialize(): Promise<void> {
        if (!this.isBackTest) {
            this._realtimeDB = await getRealTimeDatabase()
        }

        if (!this.isBackTest) {
            this._mongoDB = new MongodbManagerClass(this._baseParams.mongoDbName)
            await this._mongoDB.connect()
        }

        if (!this.isBackTest) {
            await this.loadBotStatus(true)
            await this.loadBotResult(true)
        }

        if (this._botResult.initialBadget === 0) {
            await this.updateBadget()
            this._botResult.initialBadget = this._botResult.currentBadget
        }

        if (isNaN(this._botResult.initialBadget) || this._botResult.initialBadget === 0) {
            throw new Error('Update initial badget error.')
        }
    }

    private async isStopOrClearPosition(): Promise<boolean> {
        if (this._botStatus.isStop) {
            this._botStatus.message = 'Stopping...'
            await sleep(1000)
            return true
        }
        if (this._botStatus.isClear) {
            await this.clearPosition()
            this._botStatus.isClear = false
            this._botStatus.message = 'Position cleared.'
            await sleep(1000)
            return true    
        }
        return false
    }

    private async getBotStatusFromRealtimeDbAndIsContinue(): Promise<boolean> {
        if (!this._realtimeDB) throw new Error("no realtime db.")
        this._botStatus = await this._realtimeDB.get(await this._realtimeDB.getReference("botStatus/" + this._baseParams.botName)) as BaseBotStatus
        return !this._botStatus.isExit
    }

    private async loadBotStatus(initialized?: boolean): Promise<void> {
        const res = await this.loadFromRealtimeDB(MONGO_PATH_BOTSTATUS) 
        if (res == null) {
            if (initialized) {
                return
            }
            throw new Error('failed load botStatus')
        }
        this._botStatus = res as BaseBotStatus
    }

    private async saveBotStatus(): Promise<void> {
        await this.saveToRealtimeDB(MONGO_PATH_BOTSTATUS, this._botStatus)
    }

    private async loadBotResult(initialized?: boolean): Promise<void> {
        const res = await this.loadFromRealtimeDB(MONGO_PATH_BOTRESULT)
        if (res == null) {
            if (initialized) {
                return
            }
            throw new Error('failed load botResult')
        }
        this._botResult = res as BaseBotResult
    }

    private async saveBotResult(): Promise<void> {
        await this.saveToRealtimeDB(MONGO_PATH_BOTRESULT, this._botResult)
    }

    protected async loadFromMongoDB(path: string, filter?:any): Promise<any> {
        if (!this.isBackTest && this._mongoDB) {
            const res = await this._mongoDB.find(path, filter)
            if (res.result) return res.data
        }        
    }

    protected async saveToMongoDB(path: string, data: any, filter?: any): Promise<void> {
        if (!this.isBackTest && this._mongoDB) {
            await this._mongoDB.upsert(path, filter, data)
        }
    }

    protected abstract clearPosition(): Promise<void>

    protected abstract updateTicker(): Promise<void>

    protected abstract updateBadget(): Promise<void> 

    protected abstract updateTrade(): Promise<void>

    private async loadFromRealtimeDB(path: string): Promise<Object | null> {
        if (!this._realtimeDB) throw new Error("no realtime db.")
        return await this._realtimeDB.get(await this._realtimeDB.getReference(path + "/" + this._baseParams.botName))
    }

    private async saveToRealtimeDB(path: string, data: Object): Promise<void> {
        if (!this._realtimeDB) throw new Error("no realtime db.")
        await this._realtimeDB.set(path + '/' + this._baseParams.botName, data)
    }

    protected get isBackTest(): boolean {
        return this._baseParams.isBackTest? true: false
    }

    protected get botResult(): BaseBotResult {
        this._botResult.ticker = this.currentTicker
        this._botResult.updateTimestamp = new Date().toLocaleString()
        return this._botResult
    }

    protected get cumulativeProfit(): number {
        return this._botResult.cumulativeProfit
    }

    protected set cumulativeProfit(value: number) {
        this._botResult.cumulativeProfit = value
    }

    protected get currentBadget(): number {
        return this._botResult.currentBadget
    }

    protected set currentBadget(badget: number) {
        this._botResult.currentBadget = badget
    }

    protected get initialBadget(): number {
        return this._botResult.initialBadget
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