import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { postsApi } from '../api'
import { ArrowLeft, Link as LinkIcon, Image, Play, X } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { value: 1, label: '자유게시판' },
  { value: 2, label: '대회정보' },
  { value: 3, label: '용품거래' },
  { value: 4, label: '코트정보' },
]

// 링크 추가 모달
function AddLinkModal({ onClose, onAdd }: { onClose: () => void; onAdd: (url: string, text: string) => void }) {
  const [url, setUrl] = useState('')
  const [linkText, setLinkText] = useState('')

  const handleAdd = () => {
    if (!url.trim()) {
      toast.error('URL을 입력해주세요.')
      return
    }
    if (!linkText.trim()) {
      toast.error('링크 텍스트를 입력해주세요.')
      return
    }
    onAdd(url, linkText)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">링크 추가</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">URL</label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">링크 텍스트</label>
            <input
              type="text"
              value={linkText}
              onChange={e => setLinkText(e.target.value)}
              placeholder="클릭할 텍스트"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              취소
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
              추가
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 이미지 추가 모달
function AddImageModal({ onClose, onAdd }: { onClose: () => void; onAdd: (url: string) => void }) {
  const [imageUrl, setImageUrl] = useState('')

  const handleAdd = () => {
    if (!imageUrl.trim()) {
      toast.error('이미지 URL을 입력해주세요.')
      return
    }
    onAdd(imageUrl)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">이미지 추가</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">이미지 URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-2">💡 이미지 파일의 직접 URL을 입력하세요</p>
          </div>
          {imageUrl && (
            <div className="mt-3">
              <p className="text-xs text-gray-600 mb-2">미리보기:</p>
              <img 
                src={imageUrl} 
                alt="preview" 
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                onError={() => toast.error('이미지를 불러올 수 없습니다.')}
              />
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              취소
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
              추가
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 동영상 추가 모달
function AddVideoModal({ onClose, onAdd }: { onClose: () => void; onAdd: (url: string) => void }) {
  const [videoUrl, setVideoUrl] = useState('')

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
    return match ? match[1] : null
  }

  const handleAdd = () => {
    if (!videoUrl.trim()) {
      toast.error('동영상 URL을 입력해주세요.')
      return
    }
    
    const videoId = extractYouTubeId(videoUrl)
    if (!videoId) {
      toast.error('유효한 YouTube URL을 입력해주세요.')
      return
    }
    
    onAdd(videoId)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">동영상 추가</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">YouTube URL</label>
            <input
              type="url"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=... 또는 youtu.be/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-2">💡 YouTube 영상 주소를 입력하세요</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              취소
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
              추가
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 컨텐츠 프리뷰
function ContentPreview({ content }: { content: string }) {
  const renderContent = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
    const videoRegex = /\[video:([a-zA-Z0-9_-]{11})\]/g

    let parts: any[] = []
    let lastIndex = 0
    let key = 0

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

    allMatches.sort((a, b) => a.index - b.index)

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
            className="text-blue-600 hover:underline">
            {linkText}
          </a>
        )
      } else if (type === 'image') {
        parts.push(
          <img
            key={key++}
            src={groups[1]}
            alt={groups[0]}
            className="max-w-full h-auto rounded-lg my-3 border border-gray-200"
            onError={() => {}}
          />
        )
      } else if (type === 'video') {
        const videoId = groups[0]
        parts.push(
          <div key={key++} className="my-4">
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
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
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <p className="text-xs font-medium text-gray-600 mb-3">📋 미리보기</p>
      <div className="text-sm text-gray-700 leading-relaxed">
        {renderContent(content)}
      </div>
    </div>
  )
}

export default function PostEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)

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

  const insertLink = (url: string, linkText: string) => {
    const textareaElement = document.getElementById('content') as HTMLTextAreaElement
    if (textareaElement) {
      const start = textareaElement.selectionStart
      const end = textareaElement.selectionEnd
      const newContent = content.slice(0, start) + `[${linkText}](${url})` + content.slice(end)
      setContent(newContent)
      setTimeout(() => {
        textareaElement.focus()
        textareaElement.setSelectionRange(start + `[${linkText}](${url})`.length, start + `[${linkText}](${url})`.length)
      }, 0)
    }
  }

  const insertImage = (imageUrl: string) => {
    const textareaElement = document.getElementById('content') as HTMLTextAreaElement
    if (textareaElement) {
      const start = textareaElement.selectionStart
      const end = textareaElement.selectionEnd
      const newContent = content.slice(0, start) + `![이미지](${imageUrl})` + content.slice(end)
      setContent(newContent)
      setTimeout(() => {
        textareaElement.focus()
        textareaElement.setSelectionRange(start + `![이미지](${imageUrl})`.length, start + `![이미지](${imageUrl})`.length)
      }, 0)
    }
  }

  const insertVideo = (videoId: string) => {
    const textareaElement = document.getElementById('content') as HTMLTextAreaElement
    if (textareaElement) {
      const start = textareaElement.selectionStart
      const end = textareaElement.selectionEnd
      const newContent = content.slice(0, start) + `[video:${videoId}]` + content.slice(end)
      setContent(newContent)
      setTimeout(() => {
        textareaElement.focus()
        textareaElement.setSelectionRange(start + `[video:${videoId}]`.length, start + `[video:${videoId}]`.length)
      }, 0)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to={`/board/${id}`}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors">
        <ArrowLeft size={16} /> 돌아가기
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">게시글 수정</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">제목</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={200}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/200</p>
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">내용</label>
            
            {/* 삽입 버튼 */}
            <div className="flex gap-2 mb-3 pb-3 border-b border-gray-200">
              <button
                type="button"
                onClick={() => setShowLinkModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors">
                <LinkIcon size={14} />
                링크 추가
              </button>
              <button
                type="button"
                onClick={() => setShowImageModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-xs font-medium text-purple-700 hover:bg-purple-100 transition-colors">
                <Image size={14} />
                이미지 추가
              </button>
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs font-medium text-red-700 hover:bg-red-100 transition-colors">
                <Play size={14} />
                동영상 추가
              </button>
            </div>

            <textarea
              id="content"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              rows={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none leading-relaxed"
            />
          </div>

          {/* 미리보기 */}
          {content && <ContentPreview content={content} />}

          {/* 버튼 */}
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
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

      {/* 모달들 */}
      {showLinkModal && (
        <AddLinkModal 
          onClose={() => setShowLinkModal(false)} 
          onAdd={insertLink}
        />
      )}
      {showImageModal && (
        <AddImageModal 
          onClose={() => setShowImageModal(false)} 
          onAdd={insertImage}
        />
      )}
      {showVideoModal && (
        <AddVideoModal 
          onClose={() => setShowVideoModal(false)} 
          onAdd={insertVideo}
        />
      )}
    </div>
  )
}
