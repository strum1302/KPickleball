import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { videosApi } from '../api'
import type { VideoCategory, VideoList } from '../types'
import { Play, Plus, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { formatDistanceToNow } from 'date-fns'

const CATEGORIES: { value: VideoCategory | ''; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'Lesson', label: '레슨' },
  { value: 'Match', label: '경기' },
  { value: 'Highlight', label: '하이라이트' },
  { value: 'Tips', label: '팁/전략' },
]

// 사진 갤러리 샘플 데이터 (나중에 DB 연동 가능)
const photoGallery = [
  { id: 1, url: '/images/gallery/061926_1.jpg', title: '2026 6월 21일 8시 모임' },
  { id: 2, url: '/images/gallery/061926_2.jpg', title: '2026 6월 21일 8시 모임' },
  { id: 3, url: '/images/gallery/061926_3.jpg', title: '2026 6월 21일 8시 모임' },
  { id: 4, url: '/images/gallery/061926_4.jpg', title: '2026 6월 21일 8시 모임' },
  { id: 5, url: '/images/gallery/061926_5.jpg', title: '2026 6월 21일 8시 모임' },
  { id: 6, url: '/images/gallery/061926_6.jpg', title: '2026 6월 21일 8시 모임' },
  { id: 7, url: '/images/gallery/061926_7.jpg', title: '2026 6월 21일 8시 모임' },
  { id: 8, url: '/images/gallery/061926_8.jpg', title: '2026 6월 21일 8시 모임' },
  { id: 9, url: '/images/gallery/061926_9.jpg', title: '2026 6월 21일 8시 모임' },
]
const CATEGORY_MAP: Record<VideoCategory, number> = {
  'Lesson': 1,
  'Match': 2,
  'Highlight': 3,
  'Tips': 4,
}
function VideoCard({ video }: { video: VideoList }) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-video bg-black">
        {playing ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${video.youTubeVideoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="relative cursor-pointer group" onClick={() => setPlaying(true)}>
            <img
              src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youTubeVideoId}/hqdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
              <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center">
                <Play size={24} className="text-white ml-1" fill="white" />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
          {CATEGORIES.find(c => c.value === video.category)?.label}
        </span>
        <h3 className="font-medium text-gray-900 mt-2 mb-1 line-clamp-2">{video.title}</h3>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{video.authorNickname}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Eye size={12} />{video.viewCount}</span>
            <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function AddVideoModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    title: '', description: '', youTubeVideoId: '',
    thumbnailUrl: '', category: 'Lesson' as VideoCategory
  })
  const [loading, setLoading] = useState(false)

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
    return match ? match[1] : url
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  try {
    const videoId = extractVideoId(form.youTubeVideoId)
    const categoryId = CATEGORY_MAP[form.category]  // ✅ 변환!
    await videosApi.create({ 
      ...form, 
      youTubeVideoId: videoId,
      category: categoryId  // ✅ 숫자로 전송!
    })
    onSuccess()
    onClose()
  } finally {
    setLoading(false)
  }
}
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6">
        <h2 className="text-lg font-bold mb-4">영상 등록</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL 또는 Video ID</label>
            <input value={form.youTubeVideoId}
              onChange={e => setForm(f => ({ ...f, youTubeVideoId: e.target.value }))}
              placeholder="https://youtube.com/watch?v=... 또는 dQw4w9WgXcQ"
              required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
            <select value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value as VideoCategory }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              {CATEGORIES.filter(c => c.value).map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <textarea value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              취소
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
              {loading ? '등록 중...' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 사진 라이트박스 - 개선됨
function PhotoLightbox({ 
  photos, 
  initialIndex, 
  onClose 
}: { 
  photos: typeof photoGallery; 
  initialIndex: number; 
  onClose: () => void 
}) {
  const [idx, setIdx] = useState(initialIndex);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      {/* 닫기 버튼 */}
      <button 
        onClick={handleClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        aria-label="닫기"
      >
        <X size={32} />
      </button>
      
      {/* 이전 버튼 */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 text-white hover:text-gray-300 transition-colors hover:scale-110"
        aria-label="이전 사진"
      >
        <ChevronLeft size={40} />
      </button>
      
      {/* 이미지 영역 */}
      <div 
        className="max-w-5xl w-full flex flex-col items-center" 
        onClick={e => e.stopPropagation()}
      >
        <img 
          src={photos[idx].url} 
          alt={photos[idx].title} 
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
        />
        <div className="mt-4 text-center">
          <p className="text-white text-lg font-medium mb-2">{photos[idx].title}</p>
          <p className="text-gray-400 text-sm">{idx + 1} / {photos.length}</p>
        </div>
      </div>

      {/* 다음 버튼 */}
      <button 
        onClick={handleNext}
        className="absolute right-4 text-white hover:text-gray-300 transition-colors hover:scale-110"
        aria-label="다음 사진"
      >
        <ChevronRight size={40} />
      </button>
    </div>
  )
}

export default function VideoPage() {
  const [tab, setTab] = useState<'video' | 'photo'>('video')
  const [category, setCategory] = useState<VideoCategory | ''>('')
  const [videoPage, setVideoPage] = useState(1)
  const [photoPage, setPhotoPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const { isAuthenticated } = useAuthStore()

  const ITEMS_PER_PAGE = 12
  const PHOTOS_PER_PAGE = 8

  // 사진 페이지네이션 계산
  const paginatedPhotos = photoGallery.slice(
    (photoPage - 1) * PHOTOS_PER_PAGE,
    photoPage * PHOTOS_PER_PAGE
  )
  const totalPhotoPages = Math.ceil(photoGallery.length / PHOTOS_PER_PAGE)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['videos', category, videoPage],
    queryFn: () => videosApi.getList({ category: category || undefined, page: videoPage, pageSize: ITEMS_PER_PAGE })
      .then(r => r.data),
    enabled: tab === 'video',
  })

  const totalVideoPages = data?.totalPages || 1

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">갤러리</h1>
        {tab === 'video' && isAuthenticated && (
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700">
            <Plus size={16} /> 영상 등록
          </button>
        )}
      </div>

      {/* 동영상/사진 탭 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => {
            setTab('video')
            setVideoPage(1)
          }}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            tab === 'video'
              ? 'bg-green-600 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'
          }`}>
          ▶ 동영상
        </button>
        <button
          onClick={() => {
            setTab('photo')
            setPhotoPage(1)
          }}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            tab === 'photo'
              ? 'bg-green-600 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'
          }`}>
          🖼 사진
        </button>
      </div>

      {/* 동영상 탭 */}
      {tab === 'video' && (
        <>
          <div className="flex gap-2 mb-6 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat.value}
                onClick={() => { setCategory(cat.value); setVideoPage(1) }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat.value
                    ? 'bg-red-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-red-300'
                }`}>
                {cat.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-gray-400">불러오는 중...</div>
          ) : data?.items?.length === 0 ? (
            <div className="py-20 text-center text-gray-400">등록된 영상이 없습니다.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {data?.items.map((video: VideoList) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>

              {/* 동영상 페이지네이션 */}
              {totalVideoPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setVideoPage(prev => Math.max(prev - 1, 1))}
                    disabled={videoPage === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: totalVideoPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setVideoPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          videoPage === page
                            ? 'bg-red-600 text-white'
                            : 'bg-white border border-gray-200 hover:border-red-300'
                        }`}>
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setVideoPage(prev => Math.min(prev + 1, totalVideoPages))}
                    disabled={videoPage === totalVideoPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* 사진 탭 */}
      {tab === 'photo' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {paginatedPhotos.map((photo, index) => (
              <button key={photo.id}
                onClick={() => setSelectedPhotoIndex((photoPage - 1) * PHOTOS_PER_PAGE + index)}
                className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 hover:border-green-500 transition-colors">
                <img src={photo.url} alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity px-2 text-center">
                    {photo.title}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* 사진 페이지네이션 */}
          {totalPhotoPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPhotoPage(prev => Math.max(prev - 1, 1))}
                disabled={photoPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPhotoPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setPhotoPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      photoPage === page
                        ? 'bg-green-600 text-white'
                        : 'bg-white border border-gray-200 hover:border-green-300'
                    }`}>
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPhotoPage(prev => Math.min(prev + 1, totalPhotoPages))}
                disabled={photoPage === totalPhotoPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <AddVideoModal
          onClose={() => setShowModal(false)}
          onSuccess={() => refetch()}
        />
      )}

      {selectedPhotoIndex !== null && (
        <PhotoLightbox 
          photos={photoGallery} 
          initialIndex={selectedPhotoIndex} 
          onClose={() => setSelectedPhotoIndex(null)} 
        />
      )}
    </div>
  )
}
