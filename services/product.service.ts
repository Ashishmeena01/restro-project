import prisma from '@/lib/db/prisma';

export async function getPublicMenu(businessSlug: string) {
  const business = await prisma.business.findUnique({
    where: { slug: businessSlug },
    include: {
      settings: true,
      categories: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          products: {
            where: { isAvailable: true },
            orderBy: { name: 'asc' },
          },
        },
      },
    },
  });

  if (!business) return null;

  return {
    business: {
      id: business.id,
      name: business.name,
      slug: business.slug,
      tagline: business.tagline,
      logoUrl: business.logoUrl,
      address: business.address,
      phone: business.phone,
      openingHours: business.openingHours,
      currencySymbol: business.currencySymbol,
      taxRatePercent: business.taxRatePercent,
      enableCash: business.settings?.enableCash ?? true,
      enableOnline: business.settings?.enableOnline ?? true,
      upiId: business.settings?.upiId,
    },
    categories: business.categories,
  };
}

export async function getAdminProducts(
  businessId: string,
  filters?: {
    categoryId?: string;
    search?: string;
    isAvailable?: boolean;
  }
) {
  const where: any = { businessId };

  if (filters?.categoryId && filters.categoryId !== 'all') {
    where.categoryId = filters.categoryId;
  }

  if (filters?.isAvailable !== undefined) {
    where.isAvailable = filters.isAvailable;
  }

  if (filters?.search && filters.search.trim()) {
    where.OR = [
      { name: { contains: filters.search.trim() } },
      { description: { contains: filters.search.trim() } },
    ];
  }

  return await prisma.product.findMany({
    where,
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
    orderBy: [{ category: { sortOrder: 'asc' } }, { name: 'asc' }],
  });
}

export async function createProduct(businessId: string, data: {
  name: string;
  categoryId: string;
  description?: string;
  imageUrl?: string;
  price: number; // in paise
  isVeg: boolean;
  isAvailable: boolean;
}) {
  return await prisma.product.create({
    data: {
      businessId,
      name: data.name.trim(),
      categoryId: data.categoryId,
      description: data.description?.trim(),
      imageUrl: data.imageUrl?.trim() || null,
      price: data.price,
      isVeg: data.isVeg,
      isAvailable: data.isAvailable,
    },
  });
}

export async function updateProduct(
  businessId: string,
  productId: string,
  data: Partial<{
    name: string;
    categoryId: string;
    description?: string;
    imageUrl?: string;
    price: number; // in paise
    isVeg: boolean;
    isAvailable: boolean;
  }>
) {
  // Ensure product belongs to this business
  const existing = await prisma.product.findFirst({
    where: { id: productId, businessId },
  });

  if (!existing) {
    throw new Error('Product not found or access denied');
  }

  return await prisma.product.update({
    where: { id: productId },
    data: {
      ...data,
      name: data.name ? data.name.trim() : undefined,
      description: data.description !== undefined ? data.description.trim() : undefined,
      imageUrl: data.imageUrl !== undefined ? (data.imageUrl.trim() || null) : undefined,
    },
  });
}

export async function toggleProductAvailability(businessId: string, productId: string, isAvailable: boolean) {
  const existing = await prisma.product.findFirst({
    where: { id: productId, businessId },
  });

  if (!existing) {
    throw new Error('Product not found or access denied');
  }

  return await prisma.product.update({
    where: { id: productId },
    data: { isAvailable },
  });
}

export async function deleteProduct(businessId: string, productId: string) {
  const existing = await prisma.product.findFirst({
    where: { id: productId, businessId },
  });

  if (!existing) {
    throw new Error('Product not found or access denied');
  }

  return await prisma.product.delete({
    where: { id: productId },
  });
}

export async function getAdminCategories(businessId: string) {
  return await prisma.category.findMany({
    where: { businessId },
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function createCategory(businessId: string, data: {
  name: string;
  slug: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}) {
  return await prisma.category.create({
    data: {
      businessId,
      name: data.name.trim(),
      slug: data.slug.trim().toLowerCase(),
      description: data.description?.trim(),
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateCategory(
  businessId: string,
  categoryId: string,
  data: Partial<{
    name: string;
    slug: string;
    description?: string;
    sortOrder: number;
    isActive: boolean;
  }>
) {
  const existing = await prisma.category.findFirst({
    where: { id: categoryId, businessId },
  });

  if (!existing) {
    throw new Error('Category not found');
  }

  return await prisma.category.update({
    where: { id: categoryId },
    data,
  });
}

export async function deleteCategory(businessId: string, categoryId: string) {
  const existing = await prisma.category.findFirst({
    where: { id: categoryId, businessId },
  });

  if (!existing) {
    throw new Error('Category not found');
  }

  return await prisma.category.delete({
    where: { id: categoryId },
  });
}
