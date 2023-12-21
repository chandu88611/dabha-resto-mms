

const getFoodCategoryModel = (sequelize,{ DataTypes }) => {
  const FoodCategory = sequelize.define('FoodCategory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  FoodCategory.hasMany(sequelize.models.MenuItem, { foreignKey: 'categoryId', as: 'menuItems' });
  return FoodCategory;
};

export default getFoodCategoryModel;
