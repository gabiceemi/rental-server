import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { Rental } from "../entities/Rental";
import { Repository, getRepository } from "typeorm";

class RentalsRepository implements IRentalsRepository {
    private repository: Repository<Rental>;

    constructor() {
        this.repository = getRepository(Rental);
    }

    async create({ id, user_id, car_id, end_date, expected_return_date, total }: ICreateRentalDTO): Promise<Rental> {
        const rental = this.repository.create({
            id,
            user_id,
            car_id,
            end_date,
            expected_return_date,
            total
        });

        await this.repository.save(rental);

        return rental;
    }

    async findOpenRentalByCar(car_id: any): Promise<Rental> {
        return await this.repository.findOne({
            where: { car_id, end_date: null }
        });
    }

    async findOpenRentalByUser(user_id: any): Promise<Rental> {
        return await this.repository.findOne({
            where: { user_id, end_date: null }
        });
    }

    async findById(id: string): Promise<Rental> {
        const rental = await this.repository.findOne(id);
        return rental;
    }

}

export { RentalsRepository }