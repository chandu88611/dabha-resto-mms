import { DataTypes } from 'sequelize';

const getMenuItemModel = (sequelize, { DataTypes }) => {
    const MenuItem = sequelize.define('MenuItem', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
          },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        description: {
          type: DataTypes.STRING,
        },
        price: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        categoryId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
      });
    
      
    
      return MenuItem;
};

export default getMenuItemModel;
