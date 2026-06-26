import { useQuery } from '@tanstack/react-query';
import { courtsApi } from '../api'; // Importing your centralized API client

export default function CourtMapPage() {
  // TanStack Query handles the state, while your axios client fetches the data!
  const { data: courts, isLoading, error } = useQuery({
    queryKey: ['courts'],
    queryFn: async () => {
      const response = await courtsApi.getAll();
      return response.data; // Axios wraps the API response inside the 'data' property
    },
  });

  return (
    <div className="flex h-[calc(100vh-80px)] w-full bg-gray-50">
      
      {/* LEFT SIDEBAR: Court List */}
      <div className="w-1/3 min-w-[350px] bg-white p-6 overflow-y-auto shadow-lg z-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">코트 찾기 (Find a Court)</h2>
        
        {/* State Handling */}
        {isLoading && <p className="text-gray-500 animate-pulse">데이터를 불러오는 중입니다...</p>}
        {error && <p className="text-red-500">코트 정보를 불러오는데 실패했습니다.</p>}
        {!isLoading && !error && courts?.length === 0 && (
          <p className="text-gray-500">등록된 코트가 없습니다.</p>
        )}

        {/* The List */}
        <ul className="space-y-4">
          {courts?.map((court: any) => (
            <li 
              key={court.id} 
              className="p-4 border rounded-xl hover:border-green-500 hover:shadow-md cursor-pointer transition-all bg-white"
            >
              <h3 className="font-semibold text-lg text-gray-800">{court.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{court.address}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT AREA: The Map */}
      <div className="flex-1 bg-gray-200 relative flex items-center justify-center">
        {/* MAP LIBRARY PLACEHOLDER */}
        <div className="text-center">
          <p className="text-2xl text-gray-500 font-bold mb-2">지도 영역 (Map Area)</p>
          <p className="text-gray-400">Interactive Map Component will be injected here.</p>
        </div>
      </div>

    </div>
  );
}