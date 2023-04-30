import { Request, Response } from "express";

import { container, injectable } from 'tsyringe';

import { ListCategoriesUseCase } from "./ListCategoriesUseCase";

@injectable()
class ListCategoriesController {

    async handle(request: Request, response: Response): Promise<Response> {
        const listCategoriesUseCase = container.resolve(ListCategoriesUseCase);

        const all = await listCategoriesUseCase.execute();

        return response.json(all);
    }
}

export { ListCategoriesController }