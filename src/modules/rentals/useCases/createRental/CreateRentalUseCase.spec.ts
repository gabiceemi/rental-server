import dayjs from "dayjs";

import { AppError } from "@shared/errors/AppError";

import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { CreateRentalUseCase } from "./CreateRentalUseCase";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";

let createRentalUserCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsProvider: DayjsDateProvider;

describe("Create Rental", () => {
    const dayAdd24Hours = dayjs().add(1, 'day').toDate();

    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        dayjsProvider = new DayjsDateProvider();
        createRentalUserCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory, 
            dayjsProvider
        );
    });

    it("should be able to create a new rental", async () => {
        const rental = await createRentalUserCase.execute({
            user_id: "123",
            car_id: "1212",
            expected_return_date: dayAdd24Hours
        });

        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });

    it("should not be able to create a new rental if there is another open to the same user", async () => {
        expect(async () => {
            await createRentalUserCase.execute({
                user_id: "123",
                car_id: "1212",
                expected_return_date: dayAdd24Hours
            });
    
            const rental = await createRentalUserCase.execute({
                user_id: "123",
                car_id: "2121",
                expected_return_date: dayAdd24Hours
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create a new rental if there is another open to the same car", async () => {
        expect(async () => {
            await createRentalUserCase.execute({
                user_id: "123456",
                car_id: "1212",
                expected_return_date: dayAdd24Hours
            });
    
            const rental = await createRentalUserCase.execute({
                user_id: "654321",
                car_id: "1212",
                expected_return_date: dayAdd24Hours
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create a new rental with invalid return time", async () => {
        expect(async () => {
            await createRentalUserCase.execute({
                user_id: "123456",
                car_id: "1212",
                expected_return_date: dayjs().toDate()
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});