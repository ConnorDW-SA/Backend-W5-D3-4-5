import { DataTypes } from "sequelize";
import sequelize from "../../database.js";
import ProductModel from "./model.js";
import ProductCartModel from "./ProductCartModel.js";

const CartModel = sequelize.define("cart", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: "active" },
  total: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
});

ProductModel.belongsToMany(CartModel, {
  through: ProductCartModel,
  foreignKey: { name: "productId", allowNull: false }
});

CartModel.belongsToMany(ProductModel, {
  through: ProductCartModel,
  foreignKey: { name: "cartId", allowNull: false }
});

export default CartModel;
