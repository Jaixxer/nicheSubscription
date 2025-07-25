export class RegisterCommand {
    constructor(
        public readonly email: string,
        public readonly password: string,
        public readonly roles: string[],
        public readonly phone?: string,
        public readonly firstName?: string,
        public readonly lastName?: string
    ) {}
}