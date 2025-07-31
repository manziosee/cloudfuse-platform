export function getPaginationParams(query: { page?: number; limit?: number }) {
  const page = query.page ? parseInt(query.page.toString(), 10) : 1;
  const limit = query.limit ? parseInt(query.limit.toString(), 10) : 10;
  const skip = (page - 1) * limit;
  return { skip, take: limit };
}