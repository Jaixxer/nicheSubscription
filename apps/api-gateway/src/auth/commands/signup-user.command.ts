export class SignupUserCommand {
    constructor(
        public readonly email: string,
        public readonly password: string,
        public readonly role: string[],
        public readonly phone?: string,
        public readonly firstName?: string,
        public readonly lastName?: string,
    ) {}
}
