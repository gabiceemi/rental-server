import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory);
});
+
describe("List Cars", () => {
    it("should be able to list all available cars", async () => {
        const car = await carsRepositoryInMemory.create({
            "name": "ONIX",
            "description": "ONIX Automático",
            "daily_rate": 140,
            "license_plate": "ABC-1234", 
            "fine_amount": 100, 
            "brand": "Chevrolet", 
            "category_id": "category_id"
        });

        const cars = await listCarsUseCase.execute({});

        expect(cars).toEqual([car]);
    });

    it("should be able to list all available cars by brand", async () => {
        const car = await carsRepositoryInMemory.create({
            "name": "ONIX",
            "description": "ONIX Automático",
            "daily_rate": 140,
            "license_plate": "ABC-1234", 
            "fine_amount": 100, 
            "brand": "Chevrolet", 
            "category_id": "category_id"
        });

        const cars = await listCarsUseCase.execute({
            brand: "Chevrolet"
        });

        expect(cars).toEqual([car]);
    });

    it("should be able to list all available cars by name", async () => {
        const car = await carsRepositoryInMemory.create({
            "name": "ONIX",
            "description": "ONIX Automático",
            "daily_rate": 140,
            "license_plate": "ABC-1234", 
            "fine_amount": 100, 
            "brand": "Chevrolet", 
            "category_id": "category_id"
        });

        const cars = await listCarsUseCase.execute({
            name: "ONIX"
        });

        expect(cars).toEqual([car]);
    });

    it("should be able to list all available cars by category", async () => {
        const car = await carsRepositoryInMemory.create({
            "name": "ONIX",
            "description": "ONIX Automático",
            "daily_rate": 140,
            "license_plate": "ABC-1234", 
            "fine_amount": 100, 
            "brand": "Chevrolet", 
            "category_id": "12345"
        });

        const cars = await listCarsUseCase.execute({
            category_id: "12345"
        });

        expect(cars).toEqual([car]);
    });
});