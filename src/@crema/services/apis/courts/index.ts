import jwtAxios, { ApiUrl } from '@/@crema/services/jwt-auth';

const API_URL = `${ApiUrl}/courts`;

// -------------------- Interfaces --------------------
export interface Province {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
  provinceId?: number;
}

export interface Court {
  id: number;
  name: string;
  phoneNumber?: string | null;
  pricePerHour: string | number; // API returns as string
  publicUrl?: string | null;
  address: string;
  latitude?: string | number; // API returns as string
  longitude?: string | number; // API returns as string
  isActive?: boolean;
  province: Province;
  district: District;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginateObject<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export type CourtListResponse = PaginateObject<Court>;

export interface CourtListParams {
  page?: number;
  size?: number;
  search?: string;
  provinceId?: number;
  districtId?: number;
  sort?: string;
}

export interface CreateCourtBody {
  name: string;
  phoneNumber?: string;
  pricePerHour: number;
  publicUrl?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  provinceId: number;
  districtId: number;
  isActive?: boolean;
}

export interface UpdateCourtBody extends Partial<CreateCourtBody> {
  id: number;
}

// -------------------- API Functions --------------------
export const courtService = {
  // Get list of courts
  async getCourts(params?: CourtListParams): Promise<CourtListResponse> {
    // Build query string
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    if (params?.sort) queryParams.append('sort', params.sort);

    // Build filter string if needed
    const filters: string[] = [];
    if (params?.search) filters.push(`name_like_${params.search}`);
    if (params?.provinceId) filters.push(`province.id_eq_${params.provinceId}`);
    if (params?.districtId) filters.push(`district.id_eq_${params.districtId}`);

    if (filters.length > 0) {
      queryParams.append('filter', filters.join(','));
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${API_URL}?${queryString}` : API_URL;

    const response = await jwtAxios.get<CourtListResponse>(url);
    return response.data;
  },

  // Get all courts (for map view)
  async getAllCourts(page: number = 1, size: number = 100): Promise<CourtListResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('size', size.toString());
    const url = `${API_URL}/all?${queryParams.toString()}`;
    const response = await jwtAxios.get<CourtListResponse>(url);
    return response.data;
  },

  // Get single court by ID
  async getCourtById(id: number): Promise<Court> {
    const response = await jwtAxios.get<{ data: Court }>(`${API_URL}/${id}`);
    return response.data.data;
  },

  // Create new court
  async createCourt(body: CreateCourtBody): Promise<Court> {
    const response = await jwtAxios.post(API_URL, body);
    return response.data;
  },

  // Update court
  async updateCourt(id: number, body: Partial<CreateCourtBody>): Promise<Court> {
    const response = await jwtAxios.put(`${API_URL}/${id}`, body);
    return response.data;
  },

  // Delete court
  async deleteCourt(id: number): Promise<void> {
    await jwtAxios.delete(`${API_URL}/${id}`);
  },
};
