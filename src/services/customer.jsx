const fetchCustomers = async (token) => {
  try {
    const response = await fetch('/api/customers/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('API Error:', err);
    throw err; 
  }
};

export { fetchCustomers };
