import { UserRoles } from "libs/common/enums";
import { BaseCommand } from "../../../common/cqrs/base.command";
export class CreateUserByAdmin extends BaseCommand{
    constructor(
        public readonly email:string,
        public readonly password:string,
        public readonly role :  UserRoles,
        public readonly phone?: string,
        public readonly firstName? : string,
        public readonly lastName? :string,
        

    ){super()}
}