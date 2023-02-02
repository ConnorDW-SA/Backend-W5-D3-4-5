import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import ProductModel from "../product/model.js";
import UserModel from "./model.js";

const UserRouter = express.Router();

UserRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.name) query.name = { [Op.iLike]: `${req.query.name}%` };
    const users = await UserModel.findAll({
      where: { ...query },
      attributes: { exclude: ["createdAt", "updatedAt"] }
    });
    res.send(users);
  } catch (error) {
    next(error);
  }
});

UserRouter.get("/:id", async (req, res, next) => {
  try {
    const user = await UsersModel.findByPk(req.params.id, {
      attributes: { exclude: ["createdAt", "updatedAt"] }
    });
    if (!user) {
      next(createHttpError(404, "User not found"));
    } else {
      res.send(user);
    }
  } catch (error) {
    next(error);
  }
});

UserRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await UserModel.create(req.body);
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

UserRouter.put("/:id", async (req, res, next) => {
  try {
    const [updatedRows, updatedRecords] = await UserModel.update(req.body, {
      where: { id: req.params.id },
      returning: true
    });
    if (updatedRows > 0) {
      res.send(updatedRecords[0]);
    } else {
      next(createHttpError(404, "User not found"));
    }
  } catch (error) {
    next(error);
  }
});

UserRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedRows = await UserModel.destroy({
      where: { id: req.params.id }
    });
    if (deletedRows > 0) {
      res.status(204).send();
    } else {
      next(createHttpError(404, "User not found"));
    }
  } catch (error) {
    next(error);
  }
});

export default UserRouter;
