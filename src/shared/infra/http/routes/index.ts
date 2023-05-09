import { Router } from 'express';

import { usersRoutes } from './users.routes';
import { categoriesRoutes } from './categories.routes';
import { authenticateRoutes } from './authenticate.routes';
import { specificationsRoutes } from './specifications.routes';
import { carsRoutes } from './cars.routes';
import { rentalsRoutes } from './rentals.routes';

const router = Router();

router.use("/users", usersRoutes);
router.use("/categories", categoriesRoutes);
router.use("/specifications", specificationsRoutes);
router.use("/cars", carsRoutes);
router.use("/rentals", rentalsRoutes);
router.use(authenticateRoutes);

export { router }