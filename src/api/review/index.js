import express from "express";
import ReviewModel from "./model.js";
import UserModel from "../user/model.js";
import createHttpError from "http-errors";
import { Op } from "sequelize";

const ReviewRouter = express.Router();

ReviewRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await ReviewModel.findAll({
      include: [{ model: UserModel, attributes: ["name", "surname"] }]
    });
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

ReviewRouter.get("/:id", async (req, res, next) => {
  try {
    const review = await ReviewModel.findByPk(req.params.id, {
      include: [{ model: UserModel, attributes: ["name", "surname"] }]
    });
    if (review) {
      res.send(review);
    } else {
      next(createHttpError(404, `Review with id ${req.params.id} not found`));
    }
  } catch (error) {
    next(error);
  }
});

ReviewRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ReviewModel.create(req.body);
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

ReviewRouter.put("/:id", async (req, res, next) => {
  try {
    const [updatedRows, updatedRecords] = await ReviewModel.update(req.body, {
      where: { id: req.params.id },
      returning: true
    });
    if (updatedRows > 0) {
      res.send(updatedRecords[0]);
    } else {
      next(createHttpError(404, `Review with id ${req.params.id} not found`));
    }
  } catch (error) {
    next(error);
  }
});

ReviewRouter.delete("/:id", async (req, res, next) => {
  try {
    const rows = await ReviewModel.destroy({
      where: { id: req.params.id }
    });
    if (rows > 0) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `Review with id ${req.params.id} not found`));
    }
  } catch (error) {
    next(error);
  }
});

export default ReviewRouter;
