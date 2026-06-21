import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { postsApi } from '../api'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { value: 1, label: '자유게시판' },
  { value: 2, label: '대회정보' },
  { value: 3, label: '용품거래' },
  { value: 4, label: '코트정보' },
]

export default function PostEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const { data: post } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postsApi.getById(Number(id)).then(r => r.data),
    enabled: !!id,
  })

  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setContent(post.content)
    }
  }, [post])

  const updateMutation = useMutation({
    mutationFn: () => postsApi.update(Number(id), { title, content }),
    onSuccess: () => {
      toast.success('게시글이 수정됐습니다!')
      navigate(`/board/${id}`)
    },
    onError: () => toast.error('수정에 실패했습니다.'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      toast.error('제목과 내용을 입력해주세요.')
      return
    }
    updateMutation.mutate()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to={`/board/${id}`}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 mb-6">
        <ArrowLeft size={16} /> 돌아가기
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">게시글 수정</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">제목</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">내용</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              rows={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Link to={`/board/${id}`}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              취소
            </Link>
            <button type="submit"
              disabled={updateMutation.isPending}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
              {updateMutation.isPending ? '수정 중...' : '수정 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}