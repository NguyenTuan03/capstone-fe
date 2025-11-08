import { User } from './user';

export type ConfigurationDataType = 'string' | 'number' | 'boolean' | 'json';

export interface Configuration {
  id: number;
  key: string;
  value: string;
  description?: string;
  dataType: ConfigurationDataType;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: User;
  updatedBy?: User;
}

// API types
export interface CreateConfigurationDto {
  key: string;
  value: string;
  description?: string;
  dataType: ConfigurationDataType;
}

export interface UpdateConfigurationDto {
  key?: string;
  value?: string;
  description?: string;
  dataType?: ConfigurationDataType;
}

export interface GetConfigurationsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  dataType?: ConfigurationDataType | 'all';
}

export interface GetConfigurationsResponse {
  items: Configuration[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  metadata?: any;
}
