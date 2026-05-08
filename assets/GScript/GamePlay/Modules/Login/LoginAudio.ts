import { BL } from "../../../core/modules/res/ResConst";

const B = (m: string) => BL(`Res/Audio/${m}`, "LoginBN");

export const LoginAudio = {
    bgm: B("background"),
}
