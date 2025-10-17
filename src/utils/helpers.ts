import mongoose from "mongoose";

export const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const toObjectId = (id: string): mongoose.Types.ObjectId => {
  return new mongoose.Types.ObjectId(id);
};

export const formatDate = (date: Date): string => {
  return date.toISOString();
};

export const isDateInFuture = (date: Date): boolean => {
  return date > new Date();
};

export const sanitizeQuery = (query: any): any => {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

export const buildSortOptions = (
  sortBy: string = "createdAt",
  sortOrder: string = "desc"
): any => {
  const order = sortOrder === "asc" ? 1 : -1;
  return { [sortBy]: order };
};

export const calculatePagination = (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit };
};

export const buildPaginationResponse = (
  page: number,
  limit: number,
  totalCount: number
) => {
  const totalPages = Math.ceil(totalCount / limit);

  return {
    currentPage: page,
    totalPages,
    totalCount,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
