require("dotenv").config({ path: ".env.local" });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function run() {
  if (!process.env.MONGODB_URI) {
    console.log("❌ MONGODB_URI not found in .env.local");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const UserSchema = new mongoose.Schema(
    {
      name: String,
      email: String,
      phone: String,
      passwordHash: String,
      role: String,
    },
    { timestamps: true }
  );

  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  const email = "admin@danaliph.com";
  const password = "Admin12345";

  const exists = await User.findOne({ email });
  if (exists) {
    console.log("✅ Admin already exists:", email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await User.create({
    name: "Dan Aliph Admin",
    email,
    phone: "",
    passwordHash,
    role: "admin",
  });

  console.log("✅ Admin created successfully!");
  console.log("Email:", email);
  console.log("Password:", password);

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
