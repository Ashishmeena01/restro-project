import QRCode from 'qrcode';
import prisma from '@/lib/db/prisma';

export async function generateQrDataUrl(url: string): Promise<string> {
  return await QRCode.toDataURL(url, {
    width: 320,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });
}

export async function getBusinessQrCodes(businessId: string, baseUrl: string) {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: {
      tables: {
        orderBy: { tableNumber: 'asc' },
      },
    },
  });

  if (!business) throw new Error('Business not found');

  // General menu URL
  const generalMenuUrl = `${baseUrl}/menu`;
  const generalQrImage = await generateQrDataUrl(generalMenuUrl);

  // Table QR codes
  const tableQrs = await Promise.all(
    business.tables.map(async (table) => {
      const tableUrl = `${baseUrl}/menu?table=${encodeURIComponent(table.tableNumber)}`;
      const qrImage = await generateQrDataUrl(tableUrl);
      return {
        tableId: table.id,
        tableNumber: table.tableNumber,
        capacity: table.capacity,
        url: tableUrl,
        qrImage,
      };
    })
  );

  return {
    general: {
      name: `${business.name} - General Menu`,
      url: generalMenuUrl,
      qrImage: generalQrImage,
    },
    tables: tableQrs,
  };
}

export async function createTableWithQr(businessId: string, tableNumber: string, capacity: number = 4) {
  const existing = await prisma.restaurantTable.findFirst({
    where: { businessId, tableNumber },
  });

  if (existing) {
    throw new Error(`Table "${tableNumber}" already exists.`);
  }

  const table = await prisma.restaurantTable.create({
    data: {
      businessId,
      tableNumber,
      capacity,
      isActive: true,
    },
  });

  return table;
}
