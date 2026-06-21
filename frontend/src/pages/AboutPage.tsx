import { Link } from 'react-router-dom'

const executives = [
  { role: '회장', name: '홍길동', region: '시카고' },
  { role: '부회장', name: '김철수', region: 'LA' },
  { role: '총무', name: '이영희', region: '뉴욕' },
  { role: '감사', name: '박민준', region: '달라스' },
]

const clubs = [
  { name: '시카고 K-피클볼 클럽', region: 'Illinois', members: 45, founded: '2022' },
  { name: 'LA 코리안 피클볼', region: 'California', members: 62, founded: '2021' },
  { name: '뉴욕 한인 피클볼', region: 'New York', members: 38, founded: '2023' },
  { name: '달라스 피클볼 클럽', region: 'Texas', members: 29, founded: '2023' },
  { name: '시애틀 코리안 피클볼', region: 'Washington', members: 22, founded: '2024' },
  { name: '애틀랜타 피클볼 클럽', region: 'Georgia', members: 18, founded: '2024' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* 페이지 헤더 */}
<div className="mb-6">
  <h1 className="text-2xl font-bold text-gray-900">클럽소개</h1>
  <p className="text-gray-500 text-sm mt-1">K-Pickleball 클럽을 소개합니다</p>
</div>

      <div className="max-w-6xl mx-auto px-4 py-8">

    {/* 클럽 소개 */}
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-green-600 rounded-full inline-block"></span>
        코치 소개
      </h2>

    {/* 창립자 사진 (중앙, 사각형, 더 크게) */}
    <div className="flex justify-center mb-5">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md rounded-lg overflow-hidden border border-gray-200">
          <img src="/images/founder.jpg" alt="창립자 우성직" className="w-full h-auto" />
        </div>
        <p className="text-center mt-3 whitespace-nowrap">
          <span className="font-bold text-gray-800 text-sm">우성직</span>
          <span className="text-gray-500 text-xs ml-1.5">창립자/회장</span>
        </p>
      </div>
    </div>
      {/* 소개 텍스트 */}
      <div className="text-gray-600 leading-relaxed">
        <p className="mb-3">
          <strong className="text-gray-800">K-Pickleball (Korean Pickleball Association of America)</strong>는
          시카고 일원 한인들의 건강 증진을 위해 설립된 피클볼 커뮤니티입니다.
        </p>
        <p className="mb-3">
          전 시카고 한인 테니스 협회장을 역임하신 <strong className="text-gray-800">우성직</strong> 회장이
          창립하여, 한인 피클볼의 대중화와 동호인 간 친목 도모를 위해 꾸준히 힘쓰고 있습니다.
        </p>
        <p>
          앞으로도 더 많은 한인 동호인들이 피클볼을 통해 건강을 챙기고 서로 교류할 수 있는
          장을 만들어가는 것을 목표로 하고 있습니다.
        </p>
      </div>
    </div>


        {/* 임원진 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-yellow-500 rounded-full inline-block"></span>
            임원진
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {executives.map((exec, i) => (
              <div key={i} className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                  👤
                </div>
                <p className="text-xs text-green-600 font-medium mb-1">{exec.role}</p>
                <p className="font-bold text-gray-800">{exec.name}</p>
                <p className="text-xs text-gray-500 mt-1">{exec.region}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 가입 클럽 현황 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-purple-500 rounded-full inline-block"></span>
            가입 클럽 현황
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="px-4 py-2 text-left">클럽명</th>
                  <th className="px-4 py-2 text-left">지역</th>
                  <th className="px-4 py-2 text-center">회원수</th>
                  <th className="px-4 py-2 text-center">창단년도</th>
                </tr>
              </thead>
              <tbody>
                {clubs.map((club, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2.5 font-medium text-gray-800">{club.name}</td>
                    <td className="px-4 py-2.5 text-gray-600">{club.region}</td>
                    <td className="px-4 py-2.5 text-center text-gray-600">{club.members}명</td>
                    <td className="px-4 py-2.5 text-center text-gray-600">{club.founded}년</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 회원가입 안내 */}
        <div className="bg-green-600 text-white rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold mb-2">K-Pickleball과 함께 하세요!</h3>
          <p className="text-green-100 mb-4">전국의 한인 피클볼 동호인들과 함께 즐거운 피클볼 라이프를 만들어가세요.</p>
          <Link to="/register"
            className="inline-block bg-white text-green-700 font-bold px-8 py-3 rounded-full hover:bg-green-50 transition-colors">
            회원 가입하기
          </Link>
        </div>
      </div>
    </div>
  )
}
