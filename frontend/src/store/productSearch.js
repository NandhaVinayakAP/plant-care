export const searchProducts = async (searchTerm, category, page, limit) => {
  try {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (category) params.append('category', userId);
    if (page !== undefined) params.append('page', page);
    if (limit !== undefined) params.append('limit', limit);

    const response = await api.get(`/products/search?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};
