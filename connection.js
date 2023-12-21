// connection.js

import { Sequelize } from 'sequelize';
import getUserModel from './models/postgress/user.js';
import getMenuItemModel from './models/postgress/menuItem.js';
import getFoodCategoryModel from './models/postgress/fooCategory.js';


const sequelize = new Sequelize('dhaba', 'postgres', 'Chandu@88611', {
  host: 'localhost',
  dialect: 'postgres',
});

const models = {
  User: getUserModel(sequelize, Sequelize),
  menuItem:getMenuItemModel(sequelize, Sequelize),
  foodCategory:getFoodCategoryModel(sequelize, Sequelize)
};

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

const synchronizeDatabase = async () => {
  const eraseDatabaseOnSync = false;

  try {
    await sequelize.sync({ force: eraseDatabaseOnSync });
    console.log('Database synchronized successfully.');
    if (eraseDatabaseOnSync) {
      console.log('Creating users with messages...');
      await createUsersWithMessages();
    }
  } catch (error) {
    console.error('Error synchronizing the database:', error);
  }
};

const createUsersWithMessages = async () => {
  // Implement your logic to create users with messages here
};

testConnection();
synchronizeDatabase();

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export default sequelize;
export { models };
