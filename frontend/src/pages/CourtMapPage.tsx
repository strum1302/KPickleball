import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { courtApi } from '../api/courtApi'; // 여러분의 API 호출 경로

// 1. Leaflet 마커 아이콘 설정 (필수: 이 설정이 없으면 아이콘이 깨짐)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CourtMapPage = () => {
  // 2. TanStack Query를 통한 데이터 조회
  const { data: courts, isLoading } = useQuery({ 
    queryKey: ['courts'], 
    queryFn: () => courtApi.getAll() 
  });

  if (isLoading) return <div className="p-10 text-center">코트 정보를 불러오는 중...</div>;

  return (
    <div className="flex h-screen p-6 gap-6 bg-gray-50">
      
      {/* 왼쪽 목록 영역 */}
      <div className="w-1/3 overflow-y-auto space-y-4 pr-2">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">코트 찾기 (Find a Court)</h2>
        {courts?.map((court: any) => (
          <div key={court.id} className="p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-green-500 transition-all cursor-pointer">
            <h3 className="font-bold text-lg text-green-700">{court.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{court.address}</p>
            <div className="mt-3 text-xs text-gray-400">
              {court.isIndoor ? "실내" : "실외"} | {court.numberOfCourts}개 코트
            </div>
          </div>
        ))}
      </div>

      {/* 오른쪽 지도 영역 */}
      <div className="w-2/3 h-[700px] rounded-2xl overflow-hidden shadow-xl border border-gray-100">
        {courts && courts.length > 0 ? (
          <MapContainer 
            center={[courts[0].latitude, courts[0].longitude]} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {courts.map((court: any) => (
              <Marker key={court.id} position={[court.latitude, court.longitude]}>
                <Popup>
                  <div className="font-bold">{court.name}</div>
                  <div className="text-sm">{court.address}</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-200">지도 데이터를 불러올 수 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default CourtMapPage;