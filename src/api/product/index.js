import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import ProductModel from "./model.js";
import ProductCategoryModel from "./ProductCategoryModel.js";
import CategoryModel from "../category/model.js";
import ReviewModel from "../review/model.js";
import CartModel from "./CartModel.js";
import ProductCartModel from "./ProductCartModel.js";
import UserModel from "../user/model.js";

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
      where: { ...query },
      limit: 10
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
});

ProductRouter.get("/id", async (req, res, next) => {
  try {
    const product = await ProductModel.findByPk(req.params.id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: ReviewModel,
          include: [{ model: UserModel }],
          attributes: ["comment", "rate"]
        },
        {
          model: CategoryModel,
          attributes: ["name"],
          through: { attributes: [] }
        }
      ],
      where: { ...query },
      limit: 10
    });
    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(404, `Product with id ${req.params.id} not found! `)
      );
    }
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

//---------------------

ProductRouter.put("/:id/category", async (req, res, next) => {
  try {
    const { id } = await ProductCategoryModel.create({
      productId: req.params.id,
      categoryId: req.body.categoryId
    });
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

ProductRouter.post("/:id/:userId/cart", async (req, res, next) => {
  try {
    const cartNow = await CartModel.findAll({
      where: {
        [Op.and]: [{ id: req.params.userId }, { status: "active" }]
      }
    });
    if (cartNow.length > 0) {
      await CartModel.create({ id: req.params.userId, status: "active" });
    }
    const productNow = await ProductCartModel.findAll({
      where: {
        [Op.and]: [{ id: req.params.id }, { cartId: cartNow[0].dataValues.id }]
      }
    });

    if (productNow.length == 0) {
      await ProductCartModel.create({
        ...req.body,
        cartId: cartNow[0].dataValues.id,
        id: req.params.id
      });
    } else {
      await ProductCartModel.update(
        { quantity: req.body.quantity + productNow[0].dataValues.quantity },
        {
          where: {
            [Op.and]: [
              { id: req.params.id },
              { cartId: cartNow[0].dataValues.id }
            ]
          },
          returning: true
        }
      );
    }
    res.status(201).send();
  } catch (error) {
    next(error);
  }
});

export default ProductRouter;
