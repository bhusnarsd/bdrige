'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('mst_departments', [
      { name: 'Speech Therapy', createdAt: new Date(), updatedAt: new Date() },
      { name: 'ABA', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Occupational Therapy', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Physiotherapy', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Psychology', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Readiness Program', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Admin', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Clinic Manager', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Cleaning Staff', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Clinic (MS)', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    // This method allows you to undo the seed operation (delete the inserted rows)
    await queryInterface.bulkDelete('mst_departments', null, {});
  }
};
