import { DataTypes } from "sequelize";
import sequelize from "../../database.js";

const CategoryModel = sequelize.define("category", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

export default CategoryModel;
