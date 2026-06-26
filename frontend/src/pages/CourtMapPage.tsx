import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery } from '@tanstack/react-query';
import { courtApi } from '../api/courtApi'; // 여러분의 API 호출부

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
      <div className="w-2/3 h-full rounded-2xl overflow-hidden shadow-lg border border-gray-200">
        <MapContainer center={[42.0808, -87.8963]} zoom={13} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {courts?.map((court: any) => (
            <Marker key={court.id} position={[court.latitude, court.longitude]}>
              <Popup>{court.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default CourtMapPage;