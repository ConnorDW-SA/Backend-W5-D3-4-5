import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import ProductModel from "./model.js";

const ProductRouter = express.Router();

ProductRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.name) query.name = { [Op.iLike]: `${req.query.name}%` };
    if (req.query.category)
      query.category = { [Op.iLike]: `${req.query.category}%` };
    if (req.query.price) {
      query.price = {
        [Op.between]: [req.query.price.min, req.query.price.max]
      };
    }
    const products = await ProductModel.findAll({
      where: { ...query },
      attributes: ["id", "name", "category", "price"]
    });
    res.send(products);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

ProductRouter.get("/:id", async (req, res, next) => {
  try {
    const product = await ProductModel.findByPk(req.params.id);
    if (!product) {
      next(createHttpError(404, "Product not found"));
    } else {
      res.send(product);
    }
  } catch (error) {
    next(error);
  }
});

ProductRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ProductModel.create(req.body);
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

ProductRouter.put("/:id", async (req, res, next) => {
  try {
    const [updatedRows, updatedRecords] = await ProductModel.update(req.body, {
      where: { id: req.params.id },
      returning: true
    });
    if (updatedRows > 0) {
      res.send(updatedRecords[0]);
    } else {
      next(createHttpError(404, "Product not found"));
    }
  } catch (error) {
    next(error);
  }
});

ProductRouter.delete("/:id", async (req, res, next) => {
  try {
    const rows = await ProductModel.destroy({ where: { id: req.params.id } });
    if (rows > 0) {
      res.status(204).send("Successfully deleted");
    } else {
      next(createHttpError(404, "Product not found"));
    }
  } catch (error) {
    next(error);
  }
});

//------------------Review Router------------------//
export const ReviewRouter = express.Router();

ReviewRouter.post("/:productId/review", async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }
    const { id } = await ReviewModel.create({
      ...req.body,
      productId
    });
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

export default ProductRouter;
