import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import ProductModel from "./model.js";
import ProductCategoryModel from "./ProductCategoryModel.js";
import CategoryModel from "../category/model.js";
import ReviewModel from "../review/model.js";

const ProductRouter = express.Router();

ProductRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.product)
      query.product = { [Op.iLike]: `${req.query.product}%` };
    const products = await ProductModel.findAll({
      include: [
        { model: ReviewModel, attributes: ["comment", "rate"] },
        {
          model: CategoryModel,
          attributes: ["name"],
          through: { attributes: [] }
        }
      ],
      where: { ...query }
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
});

ProductRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.product)
      query.product = { [Op.iLike]: `${req.query.product}%` };
    const products = await ProductModel.findAll({
      include: [
        { model: ReviewModel, attributes: ["comment", "rate"] },
        {
          model: CategoryModel,
          attributes: ["name"],
          through: { attributes: [] }
        }
      ],
      where: { ...query }
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
});

ProductRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ProductModel.create(req.body);
    if (req.body.category) {
      await ProductCategoryModel.bulkCreate(
        req.body.category.map((c) => {
          return { id, categoryId: c };
        })
      );
    }
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

export default ProductRouter;
