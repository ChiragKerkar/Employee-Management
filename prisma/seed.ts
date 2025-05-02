import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create a sample user
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
    },
  });

  // Create some sample employees
  await prisma.employee.createMany({
    data: [
      { name: 'John Doe', position: 'Developer', salary: 60000 },
      { name: 'Jane Smith', position: 'Designer', salary: 55000 },
      { name: 'Mike Johnson', position: 'Project Manager', salary: 70000 },
    ],
  });

  console.log('✅ Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
