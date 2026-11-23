// One-off: point seeded dishes at matching photos. Run with DATABASE_URL set: node prisma/fix-product-images.js
const { PrismaClient } = require('@prisma/client');

const W = 'https://upload.wikimedia.org/wikipedia/commons/';
const images = {
  Kachori: W + 'thumb/7/76/Kachori_MA23.jpg/960px-Kachori_MA23.jpg',
  Tea: W + '8/89/Chai_In_Sakora.jpg',
  Poha: W + 'thumb/6/68/Indori_Poha%2C_New_Delhi.jpg/960px-Indori_Poha%2C_New_Delhi.jpg',
  'Jalebi with Rabdi': W + '8/86/Jalebi-Rabdi.jpg',
  'Kesariya Lassi': W + 'thumb/5/59/Lassi_1.jpg/960px-Lassi_1.jpg',
  'Gulab Jamun (2 Pcs)': W + 'thumb/5/58/Two_Gulab_Jamun_in_a_plate_01.jpg/960px-Two_Gulab_Jamun_in_a_plate_01.jpg',
};

async function main() {
  const prisma = new PrismaClient();
  try {
    for (const [name, imageUrl] of Object.entries(images)) {
      const { count } = await prisma.product.updateMany({ where: { name }, data: { imageUrl } });
      console.log(`${name}: ${count} updated`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
