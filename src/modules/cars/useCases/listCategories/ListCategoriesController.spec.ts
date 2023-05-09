import { Connection } from 'typeorm';

import request from 'supertest';
import { v4 as uuidV4 } from 'uuid';
import { hash } from 'bcrypt';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

describe("List Categories", () => {

    let connection: Connection;

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        const id = uuidV4();
        const password = await hash("admin", 8);

        await connection.query(
            `INSERT INTO USERS( id, name, email, password, "isAdmin", created_at, driver_license )
            values('${id}', 'admin', 'admin@rental.com.br', '${password}', true, 'now()', 'XXXXXX')
            `
        );
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to list all categories", async () => {
        const responseToken = await request(app).post("/sessions")
            .send({
                email: "admin@rental.com.br",
                password: "admin"
            });

        const { token } = responseToken.body;

        await request(app).post("/categories")
            .send({
                name: "SUV",
	            description: "Categoria de carro SUV"
            }).set({
                Authorization: `Bearer ${token}`
            });

        const { body, status } = await request(app).get("/categories");
        
        expect(status).toBe(200);
        expect(body.length).toBe(1);
        expect(body[0]).toHaveProperty("id");
        expect(body[0].name).toEqual("SUV");
    });
});