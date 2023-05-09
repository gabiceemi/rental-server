import { inject, injectable } from "tsyringe";
import { verify, sign } from "jsonwebtoken";

import auth from "@config/auth";

import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";

import { AppError } from "@shared/errors/AppError";

import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";

interface IPayload {
    sub: string;
    email: string;
}

@injectable()
class RefreshTokenUseCase {
    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: DayjsDateProvider
    ) {}

    async execute(token: string) {
        const { email, sub } = verify(token, auth.secrete_refresh_token) as IPayload; 
        
        const user_id = sub;

        const userToken = await this.usersTokensRepository.findByUserIdAndRefreshToken(user_id, token);

        if(!userToken) {
            throw new AppError("Refresh Token does not exists!");
        }

        await this.usersTokensRepository.deleteById(userToken.id);

        const refresh_token = sign({ email }, auth.secrete_refresh_token, {
            subject: user_id,
            expiresIn: auth.expires_in_refresh_token
        });

        const expires_date = this.dateProvider.addDays(auth.expires_refresh_token_days);

        await this.usersTokensRepository.create({
            expires_date,
            refresh_token,
            user_id
        })

    }
}

export { RefreshTokenUseCase }