import { DataTypes } from "sequelize";
import sequelize from "../../database.js";
import CategoryModel from "../category/model.js";
import ProductCategoryModel from "./ProductCategoryModel.js";
import ReviewModel from "../review/model.js";

const ProductModel = sequelize.define("product", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

// Implement associations between Products and Reviews as one-to-many.

ProductModel.hasMany(ReviewModel, { foreignKey: { allowNull: false } });
ReviewModel.belongsTo(ProductModel);

// Implement associations between User and Review as one-to-many.

// Implement associations between Category and Product as many-to-many.

ProductModel.belongsToMany(CategoryModel, {
  through: ProductCategoryModel,
  foreignKey: { name: "productId", allowNull: false }
});
CategoryModel.belongsToMany(ProductModel, {
  through: ProductCategoryModel,
  foreignKey: { name: "categoryId", allowNull: false }
});

export default ProductModel;
