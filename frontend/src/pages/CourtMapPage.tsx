import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useQuery } from '@tanstack/react-query';
import { courtApi } from '../api/courtApi'; // 여러분의 API 호출부

// Leaflet 기본 마커 이미지 설정 (안 하면 아이콘이 안 보일 수 있음)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CourtMapPage = () => {
  const { data: courts } = useQuery({ 
    queryKey: ['courts'], 
    queryFn: () => courtApi.getAll() 
  });

  return (
    <div className="flex h-screen p-4 gap-4 bg-gray-50">
      {/* 왼쪽 목록 영역 */}
      <div className="w-1/3 overflow-y-auto space-y-4">
        <h2 className="text-2xl font-bold mb-4">코트 찾기 (Find a Court)</h2>
        {courts?.map((court: any) => (
          <div key={court.id} className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-green-500 transition-all cursor-pointer">
            <h3 className="font-bold text-lg text-green-700">{court.name}</h3>
            <p className="text-sm text-gray-600">{court.address}</p>
          </div>
        ))}
      </div>

      {/* 오른쪽 지도 영역 */}
      <div className="w-2/3 h-[600px] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
        {courts && courts.length > 0 && (
          <MapContainer 
            center={[courts[0].latitude, courts[0].longitude]} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {courts.map((court: any) => (
              <Marker key={court.id} position={[court.latitude, court.longitude]}>
                <Popup>{court.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default CourtMapPage;