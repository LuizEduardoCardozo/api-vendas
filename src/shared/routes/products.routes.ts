import { Router } from 'express';

import ProductsController from '../../modules/products/controllers/products.controller';
import createProductDTO from '../dtos/createProduct.dto';
import validate from '../middlewares/validator';

const router = Router();
const productsController = new ProductsController();

router.get('/products', productsController.getAll);
router.post('/products', validate(createProductDTO), productsController.create);
router.get('/products/:id', productsController.details);
router.patch('/products/:id', productsController.update);
router.delete('/products/:id', productsController.delete);

export default router;
