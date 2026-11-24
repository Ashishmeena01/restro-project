// Creates (or updates) a Kitchen Staff login without touching any other data.
// Usage: npm run db:kitchen-user
// Optional env overrides: KITCHEN_EMAIL, KITCHEN_PASSWORD, KITCHEN_NAME

/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const slug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
  const email = (process.env.KITCHEN_EMAIL || 'kitchen@vrindavan.com').toLowerCase().trim();
  const password = process.env.KITCHEN_PASSWORD || 'kitchen123';
  const name = process.env.KITCHEN_NAME || 'Madan Lal (Kitchen Chef)';

  const business = await prisma.business.findUnique({ where: { slug } });
  if (!business) {
    throw new Error(`Business with slug "${slug}" was not found.`);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const kitchenUser = await prisma.user.upsert({
    where: { email },
    update: {
      businessId: business.id,
      name,
      passwordHash,
      role: 'KITCHEN',
      isActive: true,
    },
    create: {
      businessId: business.id,
      name,
      email,
      passwordHash,
      role: 'KITCHEN',
      isActive: true,
    },
  });

  console.log(`✅ Kitchen login ready for ${business.name}`);
  console.log(`   Email:    ${kitchenUser.email}`);
  console.log(`   Password: ${password}`);
  console.log(`   Panel:    /kitchen`);
}

main()
  .catch((error) => {
    console.error('❌ Failed to create the kitchen user:', error.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
