import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { courtApi } from '../api/courtApi';

// 아이콘 설정
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CourtMapPage = () => {
  const { data: courts, isLoading } = useQuery({ 
    queryKey: ['courts'], 
    queryFn: () => courtApi.getAll() 
  });

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div className="flex w-full h-[calc(100vh-100px)] p-4 gap-4">
      {/* 왼쪽 리스트 */}
      <div className="w-1/3 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">코트 찾기 (Find a Court)</h2>
        <ul className="space-y-4">
          {courts?.map((court: any) => (
            <li key={court.id} className="p-4 bg-white border border-gray-200 rounded-xl hover:border-green-500 cursor-pointer shadow-sm transition-all">
              <h3 className="font-semibold text-lg text-gray-800">{court.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{court.address}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* 오른쪽 지도 - 높이를 명시적으로 설정 */}
      <div className="w-2/3 rounded-2xl overflow-hidden shadow-lg border" style={{ height: '100%' }}>
        {courts && courts.length > 0 ? (
          <MapContainer 
            center={[courts[0].latitude, courts[0].longitude]} 
            zoom={13} 
            style={{ width: '100%', height: '100%' }} // ✅ inline style 추가
          >
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors' // ✅ attribution 추가
            />
            {courts.map((court: any) => (
              <Marker key={court.id} position={[court.latitude, court.longitude]}>
                <Popup>{court.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            지도를 불러올 수 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default CourtMapPage;