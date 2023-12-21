

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


  return FoodCategory;
};

export default getFoodCategoryModel;
