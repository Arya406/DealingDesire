import API from './api';

const ProductService = {
  // Fetch all gift cards as products
  async getAllProducts() {
    try {
      const response = await API.get('/giftcards');
      // Map the gift card data to match the expected product format
      return Array.isArray(response.data) ? response.data.map(card => ({
        _id: card._id,
        name: card.title || 'Untitled Gift Card',
        description: card.description || 'No description available',
        price: card.sellingPrice || 0,
        imageUrl: card.image || 'https://via.placeholder.com/300x200?text=No+Image',
        category: card.category || 'Gift Cards',
        rating: card.rating || 4.5,
        limitedEdition: card.limitedEdition || false,
        certified: card.certified || false,
        sellerId: card.seller?._id || card.seller || null,
        sellerName: card.seller?.name || card.seller?.username || 'Unknown Seller'
      })) : [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Fetch products by category
  async getProductsByCategory(category) {
    try {
      const response = await API.get('/giftcards');
      const allProducts = response.data || [];
      return allProducts
        .filter(card => card.category === category)
        .map(card => ({
          _id: card._id,
          name: card.title || 'Untitled Gift Card',
          description: card.description || 'No description available',
          price: card.sellingPrice || 0,
          imageUrl: card.image || 'https://via.placeholder.com/300x200?text=No+Image',
          category: card.category || 'Gift Cards',
          rating: card.rating || 4.5,
          limitedEdition: card.limitedEdition || false,
          certified: card.certified || false,
          sellerId: card.seller?._id || card.seller || null,
          sellerName: card.seller?.name || card.seller?.username || 'Unknown Seller'
        }));
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      throw error;
    }
  },

  // Search products
  async searchProducts(query) {
    try {
      const response = await API.get('/giftcards');
      const searchTerm = query.toLowerCase();
      const allProducts = response.data || [];
      
      return allProducts
        .filter(card => {
          const title = card.title?.toLowerCase() || '';
          const description = card.description?.toLowerCase() || '';
          return title.includes(searchTerm) || description.includes(searchTerm);
        })
        .map(card => ({
          _id: card._id,
          name: card.title || 'Untitled Gift Card',
          description: card.description || 'No description available',
          price: card.faceValue || 0,
          imageUrl: card.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image',
          category: card.category || 'Gift Cards',
          rating: card.rating || 4.5,
          limitedEdition: card.limitedEdition || false,
          certified: card.certified || false,
          sellerId: card.seller?._id || card.seller || null,
          sellerName: card.seller?.name || card.seller?.username || 'Unknown Seller'
        }));
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
};

export default ProductService;