const dns = require('dns');
const mongoose = require('mongoose');

// College/office WiFi DNS SRV block karta hai — Google DNS use karo
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      family: 4,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed!');
    console.error(`   Error: ${error.message}`);
    console.error('\n   Fix checklist:');
    console.error('   1. Atlas → Network Access → Add IP 0.0.0.0/0');
    console.error('   2. Check username/password in backend/.env');
    console.error('   3. Password mein @ ho to %40 use karo');
    console.error('   4. Backend restart karo: npm run dev\n');
    return false;
  }
};

module.exports = connectDB;