export interface BaseBotParams {
    botName: string
}

export class BaseBotClass {
    constructor(private baseParams: BaseBotParams) {

    }

    get botName():string {
        return this.baseParams.botName
    }
}