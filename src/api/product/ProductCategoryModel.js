import { DataTypes } from "sequelize";
import sequelize from "../../database.js";

const ProductCategoryModel = sequelize.define("productCategory", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  }
});

export default ProductCategoryModel;
