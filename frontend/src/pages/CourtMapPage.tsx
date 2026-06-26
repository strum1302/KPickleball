import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet 마커 아이콘 설정 (빌드 시 아이콘 경로 문제 해결)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// API 호출 함수 (별도 파일 의존성 제거)
const fetchCourts = async () => {
  const { data } = await axios.get('https://kpickleball-production.up.railway.app/api/Courts');
  return data;
};

const CourtMapPage = () => {
  const { data: courts, isLoading } = useQuery({ 
    queryKey: ['courts'], 
    queryFn: fetchCourts 
  });

  if (isLoading) return <div className="p-10 text-center">코트 정보를 불러오는 중입니다...</div>;
  if (!courts || courts.length === 0) return <div className="p-10 text-center">조회된 코트가 없습니다.</div>;

  return (
    <div className="flex w-full h-[calc(100vh-100px)] p-4 gap-4">
      {/* 왼쪽 목록 영역 */}
      <div className="w-1/3 overflow-y-auto space-y-4 pr-2">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">코트 찾기 (Find a Court)</h2>
        {courts.map((court: any) => (
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
      <div className="w-2/3 h-full rounded-2xl overflow-hidden shadow-xl border border-gray-100">
        <MapContainer 
          center={[courts[0].latitude, courts[0].longitude] as L.LatLngExpression} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {courts.map((court: any) => (
            <Marker key={court.id} position={[court.latitude, court.longitude] as L.LatLngExpression}>
              <Popup>
                <div className="font-bold">{court.name}</div>
                <div className="text-sm">{court.address}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default CourtMapPage;