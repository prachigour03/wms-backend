'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('company_details', [{
      companyName: 'ABC Technologies Pvt Ltd',
      companyCode: 'ABC001',
      gstNumber: '27ABCDE1234F1Z5',
      email: 'info@abctech.com',
      phone: '+91 9876543210',
      country: 'India',
      state: 'Maharashtra',
      city: 'Pune',
      pinCode: '411001',
      address: '5th Floor, ABC Tower, Hinjewadi Phase 1',
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('company_details', null, {});
  }
};