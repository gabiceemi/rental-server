import { Request, Response } from 'express';

import { container, injectable } from 'tsyringe';

import { CreateCategoryUseCase } from './CreateCategoryUseCase';

@injectable()
class CreateCategoryController {

    async handle(request: Request, response: Response): Promise<Response> {
        const { name, description } = request.body;
        
        const createCategoryUseCase = container.resolve(CreateCategoryUseCase);

        await createCategoryUseCase.execute({ name, description });

        return response.status(201).send();
    }
}

export { CreateCategoryController }