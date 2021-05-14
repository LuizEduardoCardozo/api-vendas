import { Router } from 'express';
import ProductsController from '../../modules/products/controllers/products.controller';

const router = Router();
const productsController = new ProductsController();

router.get('/products', productsController.getAll);
router.post('/products', productsController.create);
router.get('/products/:id', productsController.details);
router.patch('/products/:id', productsController.update);
router.delete('/products/:id', productsController.delete);

export default router;
