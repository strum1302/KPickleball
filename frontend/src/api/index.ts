import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Request 인터셉터 - JWT 자동 첨부
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response 인터셉터 - 토큰 만료 시 자동 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refreshToken = useAuthStore.getState().refreshToken
        const { data } = await axios.post('/api/auth/refresh', { refreshToken })
        useAuthStore.getState().setTokens(data.accessToken, data.refreshToken)
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return api(original)
      } catch {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ── Auth API ──────────────────────────────────────
export const authApi = {
  register: (data: { email: string; password: string; nickname: string; state?: string; city?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  googleLogin: (idToken: string) =>
    api.post('/auth/google', { idToken }),
  me: () => api.get('/auth/me'),
}

// ── Posts API ─────────────────────────────────────
export const postsApi = {
  getList: (params?: { category?: string; page?: number; pageSize?: number }) =>
    api.get('/posts', { params }),
  getById: (id: number) => api.get(`/posts/${id}`),
create: (data: { title: string; content: string; category: number }) =>
    api.post('/posts', data),
  update: (id: number, data: { title: string; content: string }) =>
    api.put(`/posts/${id}`, data),
  delete: (id: number) => api.delete(`/posts/${id}`),
  like: (id: number) => api.post(`/posts/${id}/like`),
  createComment: (postId: number, data: { content: string; parentCommentId?: number }) =>
    api.post(`/posts/${postId}/comments`, data),
  deleteComment: (postId: number, commentId: number) =>
    api.delete(`/posts/${postId}/comments/${commentId}`),
}

// ── Videos API ────────────────────────────────────
export const videosApi = {
  getList: (params?: { category?: string; page?: number; pageSize?: number }) =>
    api.get('/videos', { params }),
  getById: (id: number) => api.get(`/videos/${id}`),
  create: (data: {
    title: string; description: string
    youTubeVideoId: string; thumbnailUrl: string; category: string
  }) => api.post('/videos', data),
  delete: (id: number) => api.delete(`/videos/${id}`),
}

// ── Clubs API ─────────────────────────────────────
export const clubsApi = {
  getList: (params?: { state?: string; page?: number; pageSize?: number }) =>
    api.get('/clubs', { params }),
  getById: (id: number) => api.get(`/clubs/${id}`),
  create: (data: {
    name: string; description: string; state: string
    city: string; maxMembers: number; isPublic: boolean
  }) => api.post('/clubs', data),
  join: (id: number) => api.post(`/clubs/${id}/join`),
  leave: (id: number) => api.delete(`/clubs/${id}/leave`),
  approveMember: (clubId: number, userId: number) =>
    api.put(`/clubs/${clubId}/members/${userId}/approve`),
}

// ── Tournaments API ───────────────────────────────
export const tournamentsApi = {
  getList: (params?: { state?: string; page?: number; pageSize?: number }) =>
    api.get('/tournaments', { params }),
  getById: (id: number) => api.get(`/tournaments/${id}`),
  create: (data: object) => api.post('/tournaments', data),
  register: (id: number) => api.post(`/tournaments/${id}/register`),
}

// ── Courts API ────────────────────────────────────
export const courtsApi = {
  getAll: (params?: { state?: string }) => api.get('/courts', { params }),
  getById: (id: number) => api.get(`/courts/${id}`),
  addReview: (courtId: number, data: { rating: number; comment?: string }) =>
    api.post(`/courts/${courtId}/reviews`, data),
}

export default api
