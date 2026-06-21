// ── Auth ──────────────────────────────────────────
export interface User {
  id: number
  email: string
  nickname: string
  profileImageUrl?: string
  state?: string
  city?: string
  level: string
  role: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

// ── Post ──────────────────────────────────────────
export type BoardCategory = 'Notice' | 'Free' | 'Tournament' | 'Marketplace' | 'Court'

export interface PostList {
  id: number
  title: string
  authorNickname: string
  category: BoardCategory
  viewCount: number
  likeCount: number
  commentCount: number
  isPinned: boolean
  createdAt: string
}

export interface PostDetail extends PostList {
  content: string
  authorProfileImageUrl?: string
  isLikedByMe: boolean
  comments: Comment[]
  attachments: Attachment[]
}

export interface Comment {
  id: number
  content: string
  authorNickname: string
  authorProfileImageUrl?: string
  parentCommentId?: number
  createdAt: string
  replies: Comment[]
}

export interface Attachment {
  id: number
  fileName: string
  fileUrl: string
  fileSize: number
}

// ── Video ──────────────────────────────────────────
export type VideoCategory = 'Lesson' | 'Match' | 'Highlight' | 'Tips'

export interface VideoList {
  id: number
  title: string
  youTubeVideoId: string
  thumbnailUrl: string
  category: VideoCategory
  authorNickname: string
  viewCount: number
  createdAt: string
}

// ── Club ──────────────────────────────────────────
export interface ClubList {
  id: number
  name: string
  logoUrl?: string
  state: string
  city: string
  memberCount: number
  maxMembers: number
  isPublic: boolean
  createdAt: string
}

// ── Tournament ─────────────────────────────────────
export interface TournamentList {
  id: number
  name: string
  state: string
  city: string
  startDate: string
  registrationDeadline: string
  entryFee: number
  maxParticipants: number
  currentEntries: number
  status: string
}

// ── Common ─────────────────────────────────────────
export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}
