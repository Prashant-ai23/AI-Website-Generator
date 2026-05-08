const API_URL = 'http://localhost:3000/api/v1';

export interface ApiRequestOptions extends RequestInit {
  includeAuth?: boolean;
}

export async function apiCall(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<Response> {
  const { includeAuth = true, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers || {}),
  };

  if (includeAuth) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  return response;
}

export async function apiCallJson<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const response = await apiCall(endpoint, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API error');
  }

  return response.json();
}
