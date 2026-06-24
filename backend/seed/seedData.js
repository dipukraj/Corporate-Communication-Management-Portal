require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Department = require('../models/Department');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Department.deleteMany();

    const departments = await Department.insertMany([
      { name: 'PR Department', description: 'Public Relations & Communications' },
      { name: 'HR Department', description: 'Human Resources' },
      { name: 'Finance Department', description: 'Finance & Accounts' },
      { name: 'Technical Department', description: 'Technical Operations' },
    ]);

    await User.create([
      {
        name: 'Dipu Admin User',
        email: 'dipuraj@ccms.com',
        password: 'dipuraj@123',
        role: 'admin',
      },
      {
        name: 'Editor User',
        email: 'editor@cms.com',
        password: 'editor123',
        role: 'editor',
        department: departments[0]._id,
      },
      {
        name: 'HR User',
        email: 'hr@cms.com',
        password: 'hr1234',
        role: 'department_user',
        department: departments[1]._id,
      },
      {
        name: 'PR User',
        email: 'pr@cms.com',
        password: 'pr1234',
        role: 'department_user',
        department: departments[0]._id,
      },
    ]);

    console.log('Seed data inserted successfully!');
    console.log('\n--- Login Credentials ---');
    console.log('Admin:  dipuraj@ccms.com / dipuraj@123');
    console.log('Editor: editor@cms.com / editor123');
    console.log('HR:     hr@cms.com / hr1234');
    console.log('PR:     pr@cms.com / pr1234');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
