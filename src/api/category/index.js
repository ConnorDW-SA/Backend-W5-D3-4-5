import express from "express";
import CategoryModel from "./model.js";
import createHttpError from "http-errors";
import { Op } from "sequelize";

const CategoryRouter = express.Router();

CategoryRouter.get("/", async (req, res, next) => {
  try {
    const category = await CategoryModel.findAll();
    res.send(category);
  } catch (error) {
    next(error);
  }
});

CategoryRouter.get("/:id", async (req, res, next) => {
  try {
    const category = await CategoryModel.findByPk(req.params.id, {
      attributes: { exclude: ["createdAt", "updatedAt"] }
    });
    if (category) {
      res.send(category);
    } else {
      next(
        createHttpError(404, `Category with id ${req.params.id} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

CategoryRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await CategoryModel.create(req.body);
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

CategoryRouter.put("/:id", async (req, res, next) => {
  try {
    const [updatedRows, updatedRecords] = await CategoryModel.update(req.body, {
      where: { id: req.params.id },
      returning: true
    });
    if (updatedRows > 0) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(404, `Category with id ${req.params.id} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

CategoryRouter.delete("/:id", async (req, res, next) => {
  try {
    const rows = await CategoryModel.destroy({
      where: { id: req.params.id }
    });
    if (rows > 0) {
      res.status(204).send("Deleted");
    } else {
      next(
        createHttpError(404, `Category with id ${req.params.id} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default CategoryRouter;
