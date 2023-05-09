import { Request, Response } from "express";
import { container, injectable } from "tsyringe";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

@injectable()
class CreateRentalController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { car_id, expected_return_date } = request.body;
        const { id } = request.user;
        const createRentalUseCase = container.resolve(CreateRentalUseCase);

        const rental = await createRentalUseCase.execute({
            car_id,
            user_id: id,
            expected_return_date
        });
        console.log(rental);
        return response.status(201).json(rental);
    }
}

export { CreateRentalController }