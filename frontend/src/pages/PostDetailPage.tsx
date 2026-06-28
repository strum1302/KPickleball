import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { postsApi } from '../api'
import { useAuthStore } from '../store/authStore'
import { formatDistanceToNow } from 'date-fns'
import { Eye, ThumbsUp, MessageSquare, ArrowLeft, Trash2, Edit } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Comment } from '../types'

const CATEGORY_LABEL: Record<string, string> = {
  Notice: '공지사항',
  Free: '자유게시판',
  Tournament: '대회정보',
  Marketplace: '용품거래',
  Court: '코트정보',
}

const CATEGORY_COLOR: Record<string, string> = {
  Notice: 'bg-red-100 text-red-600',
  Tournament: 'bg-blue-100 text-blue-600',
  Marketplace: 'bg-yellow-100 text-yellow-600',
  Court: 'bg-purple-100 text-purple-600',
  Free: 'bg-gray-100 text-gray-600',
}

// 컨텐츠 렌더링 컴포넌트 (마크다운 파싱)
function ContentRenderer({ content }: { content: string }) {
  const renderContent = (text: string) => {
    // 링크 렌더링: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    // 이미지 렌더링: ![url]
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
    // 동영상 렌더링: [video:videoId]
    const videoRegex = /\[video:([a-zA-Z0-9_-]{11})\]/g

    let parts: any[] = []
    let lastIndex = 0
    let key = 0

    // 모든 정규식을 순차적으로 처리
    const allMatches: any[] = []

    let match
    linkRegex.lastIndex = 0
    while ((match = linkRegex.exec(text)) !== null) {
      allMatches.push({ type: 'link', index: match.index, match })
    }

    imageRegex.lastIndex = 0
    while ((match = imageRegex.exec(text)) !== null) {
      allMatches.push({ type: 'image', index: match.index, match })
    }

    videoRegex.lastIndex = 0
    while ((match = videoRegex.exec(text)) !== null) {
      allMatches.push({ type: 'video', index: match.index, match })
    }

    // 인덱스로 정렬
    allMatches.sort((a, b) => a.index - b.index)

    // 순차적으로 렌더링
    allMatches.forEach(({ type, match }) => {
      const [fullMatch, ...groups] = match

      if (match.index > lastIndex) {
        parts.push(
          <div key={key++} className="whitespace-pre-wrap">
            {text.slice(lastIndex, match.index)}
          </div>
        )
      }

      if (type === 'link') {
        const [linkText, url] = groups
        parts.push(
          <a
            key={key++}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium">
            {linkText}
          </a>
        )
      } else if (type === 'image') {
        parts.push(
          <img
            key={key++}
            src={groups[1]}
            alt={groups[0] || 'image'}
            className="max-w-full h-auto rounded-lg my-4 border border-gray-200 shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        )
      } else if (type === 'video') {
        const videoId = groups[0]
        parts.push(
          <div key={key++} className="my-6">
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg border border-gray-200 shadow-sm"
            />
          </div>
        )
      }

      lastIndex = match.index + fullMatch.length
    })

    if (lastIndex < text.length) {
      parts.push(
        <div key={key++} className="whitespace-pre-wrap">
          {text.slice(lastIndex)}
        </div>
      )
    }

    return parts.length > 0 ? parts : <div className="whitespace-pre-wrap">{text}</div>
  }

  return (
    <div className="text-gray-700 leading-relaxed text-sm">
      {renderContent(content)}
    </div>
  )
}

function CommentItem({ comment, onDelete, myNickname }: {
  comment: Comment
  onDelete: (id: number) => void
  myNickname?: string
}) {
  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-700">
            {comment.authorNickname[0]}
          </div>
          <span className="text-sm font-medium text-gray-800">{comment.authorNickname}</span>
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        {comment.authorNickname === myNickname && (
          <button onClick={() => onDelete(comment.id)}
            className="text-gray-300 hover:text-red-400 transition-colors">
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <p className="text-sm text-gray-700 ml-9 leading-relaxed">{comment.content}</p>

      {/* 대댓글 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-9 mt-3 space-y-3">
          {comment.replies.map(reply => (
            <div key={reply.id} className="pl-4 border-l-2 border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                  {reply.authorNickname[0]}
                </div>
                <span className="text-sm font-medium text-gray-800">{reply.authorNickname}</span>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-gray-700 ml-8 leading-relaxed">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const queryClient = useQueryClient()
  const [comment, setComment] = useState('')
  const [isLiked, setIsLiked] = useState(false)

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postsApi.getById(Number(id)).then(r => r.data),
    enabled: !!id,
  })

  const commentMutation = useMutation({
    mutationFn: (content: string) =>
      postsApi.createComment(Number(id), { content }),
    onSuccess: () => {
      toast.success('댓글이 등록됐습니다!')
      setComment('')
      queryClient.invalidateQueries({ queryKey: ['post', id] })
    },
    onError: () => toast.error('댓글 등록에 실패했습니다.'),
  })

  const deleteMutation = useMutation({
    mutationFn: () => postsApi.delete(Number(id)),
    onSuccess: () => {
      toast.success('게시글이 삭제됐습니다.')
      navigate('/board')
    },
    onError: () => toast.error('삭제에 실패했습니다.'),
  })

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) =>
      postsApi.deleteComment(Number(id), commentId),
    onSuccess: () => {
      toast.success('댓글이 삭제됐습니다.')
      queryClient.invalidateQueries({ queryKey: ['post', id] })
    },
    onError: () => toast.error('댓글 삭제에 실패했습니다.'),
  })

  const likeMutation = useMutation({
    mutationFn: () => postsApi.like(Number(id)),
    onSuccess: () => {
      setIsLiked(!isLiked)
      queryClient.invalidateQueries({ queryKey: ['post', id] })
    },
  })

  const pinMutation = useMutation({
    mutationFn: () => postsApi.togglePin(Number(id)),
    onSuccess: (res) => {
      toast.success(res.data.isPinned ? '상단에 고정됐습니다.' : '고정이 해제됐습니다.')
      queryClient.invalidateQueries({ queryKey: ['post', id] })
    },
    onError: () => toast.error('고정 처리에 실패했습니다.'),
  })

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    commentMutation.mutate(comment)
  }

  const handleDelete = () => {
    if (confirm('게시글을 삭제하시겠습니까?'))
      deleteMutation.mutate()
  }

  if (isLoading) return (
    <div className="py-20 text-center text-gray-400">불러오는 중...</div>
  )

  if (!post) return (
    <div className="py-20 text-center text-gray-400">게시글을 찾을 수 없습니다.</div>
  )

  const isAuthor = user?.nickname === post.authorNickname
  const isAdmin = user?.role === 'Admin'

  return (
    <div className="max-w-4xl mx-auto">

      {/* 뒤로가기 */}
      <Link to="/board"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors">
        <ArrowLeft size={16} />
        게시판으로 돌아가기
      </Link>

      {/* 게시글 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">

        {/* 게시글 헤더 */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  CATEGORY_COLOR[post.category] || 'bg-gray-100 text-gray-600'
                }`}>
                  {CATEGORY_LABEL[post.category] || post.category}
                </span>
                {post.isPinned && (
                  <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full font-medium">
                    📌 공지
                  </span>
                )}
              </div>
              <h1 className="text-xl font-bold text-gray-900 leading-relaxed">
                {post.title}
              </h1>
            </div>

            {/* 수정/삭제 버튼 */}
            {(isAuthor || isAdmin) && (
              <div className="flex gap-2 flex-shrink-0">
                {isAdmin && (
                  <button
                    onClick={() => pinMutation.mutate()}
                    disabled={pinMutation.isPending}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 border rounded-lg transition-colors disabled:opacity-50 ${
                      post.isPinned
                        ? 'text-yellow-600 border-yellow-300 bg-yellow-50 hover:bg-yellow-100'
                        : 'text-gray-500 border-gray-200 hover:border-yellow-300 hover:text-yellow-600'
                    }`}>
                    📌 {post.isPinned ? '고정 해제' : '상단고정'}
                  </button>
                )}
                {isAuthor && (
                  <Link to={`/board/edit/${id}`}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 px-3 py-1.5 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <Edit size={13} /> 수정
                  </Link>
                )}
                <button onClick={handleDelete}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 px-3 py-1.5 border border-gray-200 rounded-lg hover:border-red-300 transition-colors">
                  <Trash2 size={13} /> 삭제
                </button>
              </div>
            )}
          </div>

          {/* 작성자 정보 */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-700">
                {post.authorNickname?.[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{post.authorNickname}</p>
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Eye size={13} /> {post.viewCount}</span>
              <span className="flex items-center gap-1"><ThumbsUp size={13} /> {post.likeCount}</span>
              <span className="flex items-center gap-1"><MessageSquare size={13} /> {post.comments?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* 게시글 본문 */}
        <div className="px-6 py-6">
          <ContentRenderer content={post.content} />
        </div>

        {/* 좋아요 버튼 */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-center">
          <button
            onClick={() => isAuthenticated && likeMutation.mutate()}
            disabled={!isAuthenticated}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full border-2 transition-colors text-sm font-medium ${
              post.isLikedByMe || isLiked
                ? 'border-green-500 bg-green-50 text-green-600'
                : 'border-gray-200 hover:border-green-300 text-gray-500 hover:text-green-600'
            }`}>
            <ThumbsUp size={16} />
            좋아요 {post.likeCount}
          </button>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-medium text-gray-800 flex items-center gap-2">
            <MessageSquare size={16} />
            댓글 {post.comments?.length || 0}
          </h3>
        </div>

        {/* 댓글 목록 */}
        <div className="px-6">
          {post.comments?.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">
              첫 번째 댓글을 작성해보세요!
            </div>
          ) : (
            post.comments?.map((c: Comment) => (
              <CommentItem
                key={c.id}
                comment={c}
                onDelete={(commentId) => deleteCommentMutation.mutate(commentId)}
                myNickname={user?.nickname}
              />
            ))
          )}
        </div>

        {/* 댓글 작성 */}
        {isAuthenticated ? (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <form onSubmit={handleCommentSubmit}>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-700 flex-shrink-0 mt-1">
                  {user?.nickname?.[0]}
                </div>
                <div className="flex-1">
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button type="submit"
                      disabled={!comment.trim() || commentMutation.isPending}
                      className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors">
                      {commentMutation.isPending ? '등록 중...' : '댓글 등록'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="px-6 py-4 border-t border-gray-100 text-center text-sm text-gray-500">
            <Link to="/login" className="text-green-600 hover:underline font-medium">로그인</Link>
            {' '}후 댓글을 작성할 수 있습니다.
          </div>
        )}
      </div>
    </div>
  )
}
