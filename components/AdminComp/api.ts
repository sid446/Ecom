// api.ts
export const api = {
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`/api/products?${query}`);
    await handleResponse(response);
    return response.json();
  },

  async getOrders() {
    const response = await fetch('/api/orders');
    await handleResponse(response);
    return response.json();
  },

  async getUsers() {
    const response = await fetch('/api/users');
    await handleResponse(response);
    return response.json();
  },

  async createProduct(product: any) {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    await handleResponse(response);
    return response.json();
  },

  async updateProduct(id: string, product: any) {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    await handleResponse(response);
    return response.json();
  },

  async deleteProduct(id: string) {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    await handleResponse(response);
    return response.json();
  },

  // --- NEW: Generic Order Update Function ---
  // This function allows updating any field(s) on the order, including 'track'.
  async updateOrder(id: string, data: any) {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data), // Pass the generic data object (e.g., { track: 'url' })
    });
    await handleResponse(response);
    return response.json();
  },
  // ------------------------------------------

  // Updated: Refactor updateOrderStatus to use the new updateOrder function
  async updateOrderStatus(id: string, status: string) {
    // Call the generic updateOrder function with only the status field
    return this.updateOrder(id, { status });
  },
};

/**
 * A helper function to handle API responses.
 * If the response is not OK, it attempts to extract an error message from the response body.
 * @param response The fetch Response object.
 * @throws An Error with a specific message from the backend, or a generic one if no message is found.
 */
async function handleResponse(response: Response) {
  if (response.ok) {
    return;
  }

  // Attempt to parse the response body as JSON to get a detailed error message
  try {
    const errorData = await response.json();
    // Look for both 'message' and 'error' properties for robustness
    if (errorData && (errorData.message || errorData.error)) { 
      throw new Error(errorData.message || errorData.error);
    }
  } catch (e) {
    // If JSON parsing fails, the body might not be JSON, so we use the status text.
    throw new Error(
      `Request failed with status: ${response.status} ${response.statusText}`
    );
  }

  // Fallback for when the response is not JSON or has no message property
  throw new Error('An unknown error occurred.');
}