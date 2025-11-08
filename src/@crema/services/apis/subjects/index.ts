import { buildUrl } from '@/@crema/helper/BuildUrl';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface CreateSubjectDto {
  name: string;
  description?: string;
  level: string; // BEGINNER | INTERMEDIATE | ADVANCED
  status?: string; // DRAFT | PUBLISHED | ARCHIVED
}

export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateSubjectDto) => {
      try {
        const url = buildUrl('subjects');
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
        const res = await axios.post(url, data, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        return res.data;
      } catch (err: any) {
        const resData = err?.response?.data || {};
        const apiMsg = resData.message;
        const errors = resData.errors || resData.error || {};
        // Build enum-specific messages when applicable
        const parts: string[] = [];
        if (
          errors?.level ||
          (Array.isArray(apiMsg) && apiMsg.some((m: string) => /level/i.test(m)))
        ) {
          parts.push('level must be one of the following values: BEGINNER, INTERMEDIATE, ADVANCED');
        }
        if (
          errors?.status ||
          (Array.isArray(apiMsg) && apiMsg.some((m: string) => /status/i.test(m)))
        ) {
          parts.push('status must be one of the following values: DRAFT, PUBLISHED');
        }

        let msg = parts.join('; ');
        if (!msg) {
          if (typeof apiMsg === 'string') msg = apiMsg;
          else if (Array.isArray(apiMsg)) msg = apiMsg.join(', ');
          else if (errors && typeof errors === 'object') {
            try {
              msg = Object.values(errors as Record<string, any>)
                .flat()
                .join(', ');
            } catch {}
          }
        }
        if (!msg) msg = 'Tạo môn học thất bại';
        throw new Error(msg || 'Tạo môn học thất bại');
      }
    },
    onSuccess: () => {
      // refresh subject lists
      queryClient.invalidateQueries({ queryKey: ['subjects', 'list'] });
    },
  });
};

export type UpdateSubjectDto = CreateSubjectDto;

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string | number; data: UpdateSubjectDto }) => {
      const url = buildUrl(`subjects/${payload.id}`);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      try {
        const res = await axios.put(url, payload.data, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        return res.data;
      } catch (err: any) {
        const resData = err?.response?.data || {};
        const apiMsg = resData.message;
        const errors = resData.errors || resData.error || {};
        const parts: string[] = [];
        if (
          errors?.level ||
          (Array.isArray(apiMsg) && apiMsg.some((m: string) => /level/i.test(m)))
        ) {
          parts.push('level must be one of the following values: BEGINNER, INTERMEDIATE, ADVANCED');
        }
        if (
          errors?.status ||
          (Array.isArray(apiMsg) && apiMsg.some((m: string) => /status/i.test(m)))
        ) {
          parts.push('status must be one of the following values: DRAFT, PUBLISHED');
        }
        let msg = parts.join('; ');
        if (!msg) {
          if (typeof apiMsg === 'string') msg = apiMsg;
          else if (Array.isArray(apiMsg)) msg = apiMsg.join(', ');
          else if (errors && typeof errors === 'object') {
            try {
              msg = Object.values(errors as Record<string, any>)
                .flat()
                .join(', ');
            } catch {}
          }
        }
        if (!msg) msg = 'Cập nhật môn học thất bại';
        throw new Error(msg);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects', 'list'] });
    },
  });
};

export interface GetSubjectsParams {
  page?: number;
  size?: number;
  search?: string;
  level?: string; // BEGINNER | INTERMEDIATE | ADVANCED
  status?: string; // DRAFT | PUBLISHED | ARCHIVED
  filter?: string; // e.g., status_eq_PUBLISHED
}

export const useGetSubjects = (params?: GetSubjectsParams) => {
  return useQuery({
    queryKey: ['subjects', 'list', params],
    queryFn: async () => {
      const url = buildUrl('subjects');
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const res = await axios.get(url, {
        params,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return res.data;
    },
  });
};

export const useGetSubjectById = (subjectId: string | number | null | undefined) => {
  return useQuery({
    queryKey: ['subjects', 'detail', subjectId],
    queryFn: async () => {
      if (!subjectId) {
        return null;
      }
      const url = buildUrl(`subjects/${subjectId}`);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const res = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return res.data;
    },
    enabled: !!subjectId,
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const url = buildUrl(`subjects/${id}`);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      try {
        const res = await axios.delete(url, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        return res.data;
      } catch (err: any) {
        const resData = err?.response?.data || {};
        const apiMsg = resData.message;
        const errors = resData.errors || resData.error || {};

        let msg = '';
        if (typeof apiMsg === 'string') {
          msg = apiMsg;
        } else if (Array.isArray(apiMsg)) {
          msg = apiMsg.join(', ');
        } else if (errors && typeof errors === 'object') {
          try {
            msg = Object.values(errors as Record<string, any>)
              .flat()
              .join(', ');
          } catch {}
        }

        if (!msg) msg = 'Xóa môn học thất bại';
        throw new Error(msg);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects', 'list'] });
    },
  });
};
