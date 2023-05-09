import { Request, Response } from "express";

import { container, injectable } from "tsyringe";

import { CreateUserUseCase } from "./CreateUserUseCase";

@injectable()
class CreateUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { name, password, email, driver_license } = request.body;
        const createUserUseCase = container.resolve(CreateUserUseCase);

        await createUserUseCase.execute({
            name, 
            password, 
            email, 
            driver_license
        });

        return response.status(201).send();
    }
}

export { CreateUserController }