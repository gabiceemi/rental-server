import { inject, injectable } from 'tsyringe';

import { compare } from 'bcrypt';

import { sign } from 'jsonwebtoken';

import { IUsersRepository } from "../../repositories/IUsersRepository";

import { AppError } from '../../../../errors/AppError';

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
}

@injectable()
class AuthenticateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}

    async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if(!user) {
            throw new AppError("Email or password incorrect!");
        }

        const passwordMatch = await compare(password, user.password);

        if(!passwordMatch) {
            throw new AppError("Email or password incorrect!");
        }

        const token = sign({}, "6f899df687281c96765f2ab3ba4f9c31", {
            subject: user.id,
            expiresIn: "1d"
        });

        const tokenResponse: IResponse = {
            user: {
                name: (await user).name,
                email: (await user).email
            },
            token

        } 

        return tokenResponse;
    }
}

export { AuthenticateUserUseCase }