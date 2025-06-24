import { BaseCommand } from "../../common/cqrs/base.command";
import { Roles } from "libs/common/dtos";
export class CreateUserCommand extends BaseCommand{
    constructor(
        public readonly email:string,
        public readonly password:string,
        public readonly role :  Roles,
        public readonly phone?: string,
        public readonly firstName? : string,
        public readonly lastName? :string,
        

    ){super()}
}