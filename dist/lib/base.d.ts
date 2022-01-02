export interface BaseBotParams {
    botName: string;
}
export declare class BaseBotClass {
    private baseParams;
    constructor(baseParams: BaseBotParams);
    get botName(): string;
}
