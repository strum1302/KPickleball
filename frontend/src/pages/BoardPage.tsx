import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { postsApi } from '../api'
import type { BoardCategory, PostList } from '../types'
import { Eye, ThumbsUp, MessageSquare, Pin, Plus, Search } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { formatDistanceToNow } from 'date-fns'

const CATEGORIES: { value: BoardCategory | ''; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'Notice', label: '공지사항' },
  { value: 'Free', label: '자유게시판' },
  { value: 'Tournament', label: '대회정보' },
  { value: 'Marketplace', label: '용품거래' },
  { value: 'Court', label: '코트정보' },
]

export default function BoardPage() {
  const [category, setCategory] = useState<BoardCategory | ''>('')
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const { isAuthenticated } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['posts', category, page, searchKeyword],
    queryFn: () => postsApi.getList({
      category: category || undefined,
      page,
      pageSize: 20
    }).then(r => r.data),
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchKeyword(searchInput)
    setPage(1)
  }

  const handleCategoryChange = (cat: BoardCategory | '') => {
    setCategory(cat)
    setPage(1)
    setSearchKeyword('')
    setSearchInput('')
  }

  // 클라이언트 사이드 검색 필터
  const filteredItems = data?.items?.filter((post: PostList) =>
    searchKeyword
      ? post.title.toLowerCase().includes(searchKeyword.toLowerCase())
      : true
  ) || []

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">게시판</h1>
        {isAuthenticated && (
          <Link to="/board/create"
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
            <Plus size={16} /> 글쓰기
          </Link>
        )}
      </div>

      {/* 검색창 */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="검색어를 입력하세요..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button type="submit"
            className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-green-700 transition-colors font-medium">
            검색
          </button>
          {searchKeyword && (
            <button type="button"
              onClick={() => { setSearchKeyword(''); setSearchInput('') }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 text-gray-600">
              초기화
            </button>
          )}
        </div>
        {searchKeyword && (
          <p className="text-sm text-gray-500 mt-2">
            "<span className="text-green-600 font-medium">{searchKeyword}</span>" 검색 결과 
            {' '}<span className="font-medium">{filteredItems.length}건</span>
          </p>
        )}
      </form>

      {/* 카테고리 탭 */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {CATEGORIES.map(cat => (
          <button key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === cat.value
                ? 'bg-green-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'
            }`}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* 게시글 목록 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* 테이블 헤더 */}
        <div className="hidden md:grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500">
          <div className="col-span-1 text-center">분류</div>
          <div className="col-span-7 pl-2">제목</div>
          <div className="col-span-2 text-center">작성자</div>
          <div className="col-span-1 text-center">날짜</div>
          <div className="col-span-1 text-center">조회</div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-gray-400">불러오는 중...</div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            {searchKeyword ? '검색 결과가 없습니다.' : '게시글이 없습니다.'}
          </div>
        ) : (
          filteredItems.map((post: PostList) => (
            <Link key={post.id} to={`/board/${post.id}`}
              className={`flex md:grid md:grid-cols-12 items-center px-6 py-3.5 border-b border-gray-100 hover:bg-green-50 transition-colors last:border-0 ${
                post.isPinned ? 'bg-yellow-50' : ''
              }`}>
              {/* 분류 */}
              <div className="hidden md:flex col-span-1 justify-center">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  post.category === 'Notice' ? 'bg-red-100 text-red-600' :
                  post.category === 'Tournament' ? 'bg-blue-100 text-blue-600' :
                  post.category === 'Marketplace' ? 'bg-yellow-100 text-yellow-600' :
                  post.category === 'Court' ? 'bg-purple-100 text-purple-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {CATEGORIES.find(c => c.value === post.category)?.label}
                </span>
              </div>

              {/* 제목 */}
              <div className="col-span-7 flex items-center gap-2 pl-2 min-w-0">
                {post.isPinned && <Pin size={12} className="text-yellow-500 flex-shrink-0" />}
                <span className="text-sm font-medium text-gray-900 truncate">
                  {post.title}
                </span>
                {post.commentCount > 0 && (
                  <span className="text-xs text-green-600 flex-shrink-0">
                    [{post.commentCount}]
                  </span>
                )}
              </div>

              {/* 작성자 */}
              <div className="hidden md:block col-span-2 text-center text-xs text-gray-500 truncate">
                {post.authorNickname}
              </div>

              {/* 날짜 */}
              <div className="hidden md:block col-span-1 text-center text-xs text-gray-400">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: false })}
              </div>

              {/* 조회수 */}
              <div className="hidden md:flex col-span-1 justify-center items-center gap-1 text-xs text-gray-400">
                <Eye size={11} />
                {post.viewCount}
              </div>

              {/* 모바일 */}
              <div className="md:hidden flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                    {CATEGORIES.find(c => c.value === post.category)?.label}
                  </span>
                  <span className="text-sm font-medium text-gray-900 truncate">{post.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{post.authorNickname}</span>
                  <span className="flex items-center gap-1"><Eye size={10} />{post.viewCount}</span>
                  <span className="flex items-center gap-1"><ThumbsUp size={10} />{post.likeCount}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-40">
            이전
          </button>
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium ${
                page === p
                  ? 'bg-green-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'
              }`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            className="px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-40">
            다음
          </button>
        </div>
      )}
    </div>
  )
}