import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { postsApi, videosApi } from '../api'

// 샘플 클럽소식 (나중에 DB 연동)

const tournamentResults = [
  { id: 1, title: '2026 제1차 협회장배 남자 단식 결과', date: '2026-05-15' },
  { id: 2, title: '2026 제1차 협회장배 여자 단식 결과', date: '2026-05-15' },
  { id: 3, title: '2026 봄철 오픈 토너먼트 결과', date: '2026-04-20' },
]

const galleryImages = [
  { id: 1, title: '2026 협회장배 단체전', emoji: '🏆' },
  { id: 2, title: '시카고 클럽 정기모임', emoji: '🎾' },
  { id: 3, title: 'LA 오픈 토너먼트', emoji: '🏅' },
  { id: 4, title: '뉴욕 친선 경기', emoji: '🏓' },
  { id: 5, title: '달라스 대회 시상식', emoji: '🥇' },
  { id: 6, title: '전국 피클볼 페스티벌', emoji: '🎉' },
]

// 피클볼 사진 슬라이더 (Unsplash 무료 이미지)
const bannerSlides = [
  {
    imageUrl: '/images/slide1.jpg',
    title: 'K-Pickleball',
    subtitle: '미국 한인 피클볼 커뮤니티',
  },
  {
    imageUrl: '/images/slide2.jpg',
    title: '함께하는 피클볼',
    subtitle: '전국 동호인과 함께 즐기세요',
  },
  {
    imageUrl: '/images/slide3.jpg',
    title: '2026 전국 대회',
    subtitle: '참가 신청 접수 중',
  },
  {
    imageUrl: '/images/slide4.jpg',
    title: '지역 클럽 모임',
    subtitle: '가까운 클럽을 찾아보세요',
  },
  {
    imageUrl: '/images/slide5.jpg',
    title: '레슨 & 코칭',
    subtitle: '실력 향상을 위한 프로그램',
  },
]

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [imgErrors, setImgErrors] = useState<boolean[]>([false, false, false])

  // 공지사항 DB에서 가져오기 (category: 0 = Notice)
  const { data: noticeData } = useQuery({
    queryKey: ['notices'],
    queryFn: () => postsApi.getList({ category: '0', page: 1, pageSize: 5 })
      .then(r => r.data),
  })

  // 레슨 영상 DB에서 가져오기 - videosApi 사용
  const { data: lessonVideosData } = useQuery({
    queryKey: ['lessonVideos'],
    queryFn: () => videosApi.getList({ page: 1, pageSize: 5 })
      .then(r => r.data),
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const handleImgError = (index: number) => {
    setImgErrors(prev => {
      const next = [...prev]
      next[index] = true
      return next
    })
  }

  // 공지사항 - DB 데이터 또는 샘플 데이터
  const notices = noticeData?.items?.length > 0
    ? noticeData.items.map((p: any) => ({
        id: p.id,
        title: p.title,
        date: p.createdAt?.slice(0, 10) || '',
        isNew: new Date(p.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
      }))
    : [
        { id: 1, title: '2026 K-Pickleball 전국 대회 개최 안내', date: '2026-05-28', isNew: true },
        { id: 2, title: '시카고 지역 피클볼 코트 추가 오픈', date: '2026-05-20', isNew: true },
        { id: 3, title: '신규 회원 등록 안내 및 혜택', date: '2026-05-15', isNew: false },
        { id: 4, title: '5월 정기 모임 결과 보고', date: '2026-05-10', isNew: false },
        { id: 5, title: '피클볼 장비 공동구매 안내', date: '2026-05-05', isNew: false },
      ]

  // 레슨 영상 - DB 데이터 또는 샘플 데이터
  const lessonVideos = lessonVideosData?.items?.length > 0
    ? lessonVideosData.items.map((v: any) => ({
        id: v.id,
        title: v.title,
        date: v.createdAt?.slice(0, 10) || '',
        author: v.authorNickname,
        views: v.viewCount,
        youTubeVideoId: v.youTubeVideoId,
      }))
    : [
        { id: 1, title: '키친 앞 발리 피딩 연습', date: '2026-05-27', author: '테스터', views: 150, youTubeVideoId: 'dQw4w9WgXcQ' },
        { id: 2, title: '발리 기초 마스터하기', date: '2026-05-25', author: '코치 박', views: 320, youTubeVideoId: 'dQw4w9WgXcQ' },
        { id: 3, title: '써드샷 공략법', date: '2026-05-22', author: '프로 선수', views: 450, youTubeVideoId: 'dQw4w9WgXcQ' },
        { id: 4, title: '백핸드 슬라이스 배우기', date: '2026-05-18', author: '테스터', views: 280, youTubeVideoId: 'dQw4w9WgXcQ' },
      ]

  return (
    <div className="-mx-4 -mt-8">

      {/* 사진 슬라이더 */}
      <div className="relative h-64 md:h-96 overflow-hidden bg-gray-800">
        {bannerSlides.map((slide, i) => (
          <div key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}>

            {/* 배경 사진 */}
            {!imgErrors[i] ? (
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover"
                onError={() => handleImgError(i)}
              />
            ) : (
              // 사진 로드 실패 시 그라데이션 대체
              <div className="w-full h-full bg-gradient-to-r from-green-800 to-green-600" />
            )}

            {/* 어두운 오버레이 */}
            <div className="absolute inset-0 bg-black/40" />

            {/* 텍스트 */}
            <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-2xl opacity-90 drop-shadow mb-6">
                  {slide.subtitle}
                </p>
                <Link to="/board"
                  className="inline-block bg-white text-green-700 px-6 py-2.5 rounded-full font-medium hover:bg-green-50 transition-colors shadow-lg">
                  자세히 보기
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* 이전/다음 버튼 */}
        <button
          onClick={() => setCurrentSlide(prev => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors">
          ‹
        </button>
        <button
          onClick={() => setCurrentSlide(prev => (prev + 1) % bannerSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors">
          ›
        </button>

        {/* 인디케이터 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {bannerSlides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentSlide ? 'bg-white w-6' : 'bg-white/50'
              }`} />
          ))}
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="px-4 py-8 max-w-6xl mx-auto">

        {/* 2컬럼 - 뉴스/레슨영상 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* 뉴스 및 공지 - DB 연동 */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <span className="w-1 h-5 bg-green-600 rounded-full inline-block"></span>
                뉴스 및 공지
              </h3>
              <Link to="/board?category=0" className="text-xs text-gray-500 hover:text-green-600">더보기 +</Link>
            </div>
            <ul className="divide-y divide-gray-100">
              {notices.map((n: any) => (
                <li key={n.id}>
                  <Link to={`/board/${n.id}`}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-green-50 transition-colors group">
                    <div className="flex items-center gap-2 min-w-0">
                      {n.isNew && (
                        <span className="flex-shrink-0 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded font-medium">NEW</span>
                      )}
                      <span className="text-sm text-gray-700 group-hover:text-green-700 truncate">{n.title}</span>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {n.date?.slice(5)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 레슨 영상 - videosApi 연동 */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <span className="w-1 h-5 bg-red-600 rounded-full inline-block"></span>
                레슨 영상
              </h3>
              <Link to="/gallery" className="text-xs text-gray-500 hover:text-red-600">더보기 +</Link>
            </div>
            <ul className="divide-y divide-gray-100">
              {lessonVideos.map((v: any) => (
                <li key={v.id}>
                  <Link to="/gallery"
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-red-50 transition-colors group">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="flex-shrink-0 text-red-500">▶</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-700 group-hover:text-red-700 truncate">{v.title}</p>
                        <p className="text-xs text-gray-400">{v.author} • 조회 {v.views}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{v.date?.slice(5)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 지난 대회 결과 */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1 h-5 bg-yellow-500 rounded-full inline-block"></span>
              지난 대회 결과
            </h3>
            <Link to="/tournaments" className="text-xs text-gray-500 hover:text-yellow-600">더보기 +</Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {tournamentResults.map(t => (
              <li key={t.id}>
                <Link to="/tournaments"
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-yellow-50 transition-colors group">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">🏆</span>
                    <span className="text-sm text-gray-700 group-hover:text-yellow-700">{t.title}</span>
                  </div>
                  <span className="text-xs text-gray-400">{t.date.slice(5)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 갤러리 - 임시 숨김 처리 (추후 활성화 예정) */}

        {/* 하단 바로가기 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/about"
            className="bg-green-600 text-white rounded-lg p-5 hover:bg-green-700 transition-colors">
            <div className="text-3xl mb-2">🏢</div>
            <h4 className="font-bold text-lg mb-1">협회 소개</h4>
            <p className="text-sm opacity-80">K-Pickleball 협회를 소개합니다</p>
          </Link>
          <Link to="/clubs"
            className="bg-blue-600 text-white rounded-lg p-5 hover:bg-blue-700 transition-colors">
            <div className="text-3xl mb-2">👥</div>
            <h4 className="font-bold text-lg mb-1">클럽 찾기</h4>
            <p className="text-sm opacity-80">가까운 피클볼 클럽을 찾아보세요</p>
          </Link>
          <Link to="/courts"
            className="bg-yellow-600 text-white rounded-lg p-5 hover:bg-yellow-700 transition-colors">
            <div className="text-3xl mb-2">📍</div>
            <h4 className="font-bold text-lg mb-1">코트 찾기</h4>
            <p className="text-sm opacity-80">전국 피클볼 코트를 지도로 확인하세요</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
