import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { AppError } from "@shared/errors/AppError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });

    it("should be to authenticate an user", async () => {
        const user: ICreateUserDTO = {
            name: "User Test",
            password: "123456",
            email: "user@test.com",
            driver_license: "654321"
        }

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        });

        expect(result).toHaveProperty("token");
    });

    it("should not be able to authenticate an nonexistent user", () => {
        expect(async () => {
            await authenticateUserUseCase.execute({
                email: "false@email.com",
                password: "123"
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able authenticate with incorrect password,", () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                name: "User Test",
                password: "123456",
                email: "user@test.com",
                driver_license: "654321"
            }
    
            await createUserUseCase.execute(user);
    
            await authenticateUserUseCase.execute({
                email: user.email,
                password: "123"
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});