import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { postsApi } from '../api'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { value: 1, label: '자유게시판' },
  { value: 2, label: '대회정보' },
  { value: 3, label: '용품거래' },
  { value: 4, label: '코트정보' },
]

export default function PostCreatePage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<number>(1)

  const createMutation = useMutation({
    mutationFn: () => postsApi.create({ title, content, category }),
    onSuccess: (res) => {
      toast.success('게시글이 작성됐습니다!')
      navigate(`/board/${res.data}`)
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || '게시글 작성에 실패했습니다.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('제목을 입력해주세요.')
      return
    }
    if (!content.trim()) {
      toast.error('내용을 입력해주세요.')
      return
    }
    createMutation.mutate()
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* 뒤로가기 */}
      <Link to="/board"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors">
        <ArrowLeft size={16} />
        게시판으로 돌아가기
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">글쓰기</h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === cat.value
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-green-300'
                  }`}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              maxLength={200}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/200</p>
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              rows={14}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none leading-relaxed"
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <Link to="/board"
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 text-gray-600 transition-colors">
              취소
            </Link>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors">
              {createMutation.isPending ? '등록 중...' : '게시글 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}