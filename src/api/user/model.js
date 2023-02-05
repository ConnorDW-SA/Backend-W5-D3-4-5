import { DataTypes } from "sequelize";
import sequelize from "../../database.js";
import ReviewModel from "../review/model.js";
import CartModel from "../products/cartModel.js";

const UserModel = sequelize.define("user", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

UserModel.hasMany(ReviewModel, { foreignKey: "userId" });
ReviewModel.belongsTo(UserModel);

UserModel.hasMany(CartModel, { foreignKey: "cartId" });
CartModel.belongsTo(UserModel);

export default UserModel;
