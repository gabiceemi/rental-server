import { inject, injectable } from "tsyringe";

import { compare } from "bcrypt";

import { sign } from "jsonwebtoken";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

import { AppError } from "@shared/errors/AppError";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import auth from "@config/auth";

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: {
        name: string;
        email: string;
    },
    token: string;
    refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) {}

    async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);
        const { expires_in_token, expires_in_refresh_token, expires_refresh_token_days, secret_token, secrete_refresh_token } = auth;

        if(!user) {
            throw new AppError("Email or password incorrect!");
        }

        const passwordMatch = await compare(password, user.password);

        if(!passwordMatch) {
            throw new AppError("Email or password incorrect!");
        }

        const token = sign({}, secret_token, {
            subject: user.id,
            expiresIn: expires_in_token
        });

        const refresh_token = sign({ email }, secrete_refresh_token, {
            subject: user.id,
            expiresIn: expires_in_refresh_token
        });

        const refresh_token_expires_date = this.dateProvider.addDays(expires_refresh_token_days);

        await this.usersTokensRepository.create({
            expires_date: refresh_token_expires_date,
            refresh_token,
            user_id: user.id
        })

        const tokenResponse: IResponse = {
            user: {
                name: (await user).name,
                email: (await user).email
            },
            token,
            refresh_token

        } 

        return tokenResponse;
    }
}

export { AuthenticateUserUseCase }