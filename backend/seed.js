require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/student-portal';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Project.deleteMany({});
  console.log('Cleared existing data');

  const admin = await User.create({
    name: 'Super Admin',
    email: 'admin@demo.com',
    password: 'admin12',
    role: 'admin'
  });

  const teacher1 = await User.create({
    name: 'Prof. Sarah Johnson',
    email: 'teacher@demo.com',
    password: 'teacher12',
    role: 'teacher'
  });

  const teacher2 = await User.create({
    name: 'Dr. Michael Torres',
    email: 'michael@demo.com',
    password: 'teacher12',
    role: 'teacher'
  });

  const student1 = await User.create({
    name: 'Alex Chen',
    email: 'student@demo.com',
    password: 'password123',
    role: 'student'
  });

  const student2 = await User.create({
    name: 'Maria Silva',
    email: 'maria@demo.com',
    password: 'password123',
    role: 'student'
  });

  const student3 = await User.create({
    name: 'James Okonkwo',
    email: 'james@demo.com',
    password: 'password123',
    role: 'student'
  });

  const student4 = await User.create({
    name: 'Priya Patel',
    email: 'priya@demo.com',
    password: 'password123',
    role: 'student',
    status: 'suspended'
  });

  await Project.insertMany([
    { title: 'Vue.js E-Commerce Platform', description: 'Full-featured e-commerce with cart, checkout, and admin panel.', technologies: ['Vue.js', 'Node.js', 'MongoDB', 'Stripe'], category: 'web', status: 'approved', githubUrl: 'https://github.com', userId: student1._id },
    { title: 'AI Study Assistant', description: 'AI-powered study assistant that generates flashcards from PDFs.', technologies: ['Python', 'FastAPI', 'React', 'OpenAI'], category: 'ai', status: 'approved', userId: student1._id },
    { title: 'Real-Time Chat App', description: 'Real-time messaging with rooms, DMs and file sharing.', technologies: ['Vue.js', 'Socket.IO', 'Express', 'Redis'], category: 'web', status: 'pending', userId: student2._id },
    { title: 'COVID-19 Dashboard', description: 'Interactive dashboard visualizing global COVID statistics.', technologies: ['React', 'D3.js', 'Python', 'Pandas'], category: 'data', status: 'approved', userId: student2._id },
    { title: 'Campus Food Delivery', description: 'Mobile app connecting students with campus cafeterias.', technologies: ['React Native', 'Node.js', 'Firebase'], category: 'mobile', status: 'pending', userId: student3._id },
    { title: 'Tower Defense Game', description: 'Browser-based tower defense with procedural map generation.', technologies: ['JavaScript', 'Phaser.js', 'Canvas API'], category: 'game', status: 'rejected', userId: student3._id },
  ]);

  console.log('\n✅ Database seeded!');
  console.log('\nDemo accounts:');
  console.log('  Admin:   admin@demo.com   / admin12');
  console.log('  Teacher: teacher@demo.com / teacher12');
  console.log('  Student: student@demo.com / password123');
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
