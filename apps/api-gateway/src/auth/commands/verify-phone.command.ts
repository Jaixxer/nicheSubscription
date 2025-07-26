import { BaseCommand } from "../../common/cqrs/base.command";

export class VerifyPhoneCommand extends BaseCommand{
    constructor(
        public readonly userId:string,
        public readonly phoneNumber:string,
        public readonly enteredOtp: string
    ){
        super()
    }
}