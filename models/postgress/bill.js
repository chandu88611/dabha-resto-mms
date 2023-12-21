

const getBillModel = (sequelize, { DataTypes }) => {
  const Bill = sequelize.define('Bill', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    taxTotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    grandTotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    billDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    orderedItems: {
      type: DataTypes.ARRAY(DataTypes.UUID), // Assuming MenuItem IDs are UUID
      allowNull: false,
    },
  });

  return Bill;
};

export default getBillModel;
