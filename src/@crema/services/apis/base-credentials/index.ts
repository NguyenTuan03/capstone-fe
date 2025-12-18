import jwtAxios, { ApiUrl } from '@/@crema/services/jwt-auth';
import { CourseCredentialType } from '@/types/enums';

const API_URL = `${ApiUrl}/base-credentials`;

// -------------------- Interfaces --------------------
export interface BaseCredential {
  id: number;
  name: string;
  description?: string;
  type: CourseCredentialType;
  publicUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface PaginateObject<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export type BaseCredentialListResponse = PaginateObject<BaseCredential>;

export interface BaseCredentialListParams {
  page?: number;
  size?: number;
  search?: string;
  sort?: string;
  filter?: string;
}

export interface CreateBaseCredentialDto {
  name: string;
  description?: string;
  type: CourseCredentialType;
  base_credential_image?: File;
}

export interface UpdateBaseCredentialDto {
  name?: string;
  description?: string;
  type?: CourseCredentialType;
  base_credential_image?: File;
}

// -------------------- API Functions --------------------
export const baseCredentialService = {
  // Get list of base credentials (Public)
  async getBaseCredentials(params?: BaseCredentialListParams): Promise<BaseCredentialListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.filter) queryParams.append('filter', params.filter);
    if (params?.search) {
      queryParams.append('filter', `name_like_${params.search}`);
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${API_URL}?${queryString}` : API_URL;

    // Public endpoint - no auth required
    const response = await jwtAxios.get<BaseCredentialListResponse>(url);
    return response.data;
  },

  // Get single base credential by ID (Public)
  async getBaseCredentialById(id: number): Promise<BaseCredential> {
    const response = await jwtAxios.get<BaseCredential>(`${API_URL}/${id}`);
    return response.data;
  },

  // Create new base credential (Admin only)
  async createBaseCredential(data: CreateBaseCredentialDto): Promise<BaseCredential> {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    formData.append('type', data.type);
    if (data.base_credential_image) {
      formData.append('base_credential_image', data.base_credential_image);
    }

    const response = await jwtAxios.post<BaseCredential>(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update base credential (Admin only)
  async updateBaseCredential(id: number, data: UpdateBaseCredentialDto): Promise<BaseCredential> {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.type) formData.append('type', data.type);
    if (data.base_credential_image) {
      formData.append('base_credential_image', data.base_credential_image);
    }

    const response = await jwtAxios.put<BaseCredential>(`${API_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete base credential (Admin only - soft delete)
  async deleteBaseCredential(id: number): Promise<void> {
    await jwtAxios.delete(`${API_URL}/${id}`);
  },
};
