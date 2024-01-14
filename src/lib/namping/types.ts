import { MultiPositionBotParams } from "../multiPosition"
import { LogicNampingSettings } from "logic-namping"

export interface NampingBotParams extends MultiPositionBotParams {
    logicParams: LogicNampingSettings
}