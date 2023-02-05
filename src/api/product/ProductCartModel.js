import { DataTypes } from "sequelize";
import sequelize from "../../database.js";

const ProductCartModel = sequelize.define("productCart", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

export default ProductCartModel;
