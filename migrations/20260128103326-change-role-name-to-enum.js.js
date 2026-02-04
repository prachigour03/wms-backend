import { ROLE_NAMES } from "../src/constants/roleEnum.js";

export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn("roles", "name", {
    type: Sequelize.ENUM(...ROLE_NAMES),
    allowNull: false,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn("roles", "name", {
    type: Sequelize.STRING,
    allowNull: false,
  });
}
