import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { Navigate } from 'react-router-dom'
import api from '../api'
import toast from 'react-hot-toast'

// API 함수
const adminApi = {
  getPendingMembers: () => api.get('/admin/pending-members').then(r => r.data),
  getAllMembers: () => api.get('/admin/members').then(r => r.data),
  approveMember: (id: number) => api.put(`/admin/approve/${id}`),
  rejectMember: (id: number) => api.put(`/admin/reject/${id}`),
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  Pending:  { label: '대기중', color: 'bg-yellow-100 text-yellow-700' },
  Approved: { label: '정회원', color: 'bg-green-100 text-green-700' },
  Rejected: { label: '거절',   color: 'bg-red-100 text-red-700' },
}

export default function AdminPage() {
  const { user } = useAuthStore()
  const [tab, setTab] = useState<'pending' | 'members'>('pending')
  const queryClient = useQueryClient()

  // 관리자만 접근 가능
  if (user?.role !== 'Admin') {
    return <Navigate to="/" replace />
  }

  const { data: pendingMembers = [], isLoading: pendingLoading } = useQuery({
    queryKey: ['pending-members'],
    queryFn: adminApi.getPendingMembers,
  })

  const { data: allMembers = [], isLoading: membersLoading } = useQuery({
    queryKey: ['all-members'],
    queryFn: adminApi.getAllMembers,
  })

  const approveMutation = useMutation({
    mutationFn: adminApi.approveMember,
    onSuccess: (_, id) => {
      toast.success('승인되었습니다!')
      queryClient.invalidateQueries({ queryKey: ['pending-members'] })
      queryClient.invalidateQueries({ queryKey: ['all-members'] })
    },
    onError: () => toast.error('승인에 실패했습니다.'),
  })

  const rejectMutation = useMutation({
    mutationFn: adminApi.rejectMember,
    onSuccess: () => {
      toast.success('거절되었습니다.')
      queryClient.invalidateQueries({ queryKey: ['pending-members'] })
      queryClient.invalidateQueries({ queryKey: ['all-members'] })
    },
    onError: () => toast.error('거절에 실패했습니다.'),
  })

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">관리자 페이지</h1>
        <p className="text-gray-500 text-sm mt-1">회원 관리 및 승인을 처리합니다</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-yellow-500">{pendingMembers.length}</p>
          <p className="text-sm text-gray-500 mt-1">승인 대기</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-green-600">
            {allMembers.filter((m: any) => m.status === 'Approved').length}
          </p>
          <p className="text-sm text-gray-500 mt-1">정회원</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-gray-700">{allMembers.length}</p>
          <p className="text-sm text-gray-500 mt-1">전체 회원</p>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'pending'
              ? 'bg-green-600 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'
          }`}>
          승인 대기
          {pendingMembers.length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {pendingMembers.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('members')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'members'
              ? 'bg-green-600 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'
          }`}>
          전체 회원
        </button>
      </div>

      {/* 승인 대기 목록 */}
      {tab === 'pending' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="font-medium text-gray-800">승인 대기 회원</h3>
          </div>
          {pendingLoading ? (
            <div className="py-20 text-center text-gray-400">불러오는 중...</div>
          ) : pendingMembers.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <p className="text-4xl mb-3">✅</p>
              <p>대기 중인 회원이 없습니다</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left font-medium text-gray-600">닉네임</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">이메일</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">지역</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">가입일</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">처리</th>
                </tr>
              </thead>
              <tbody>
                {pendingMembers.map((member: any) => (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{member.nickname}</td>
                    <td className="px-4 py-3 text-gray-600">{member.email}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {member.state} {member.city}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(member.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => approveMutation.mutate(member.id)}
                          disabled={approveMutation.isPending}
                          className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-green-700 disabled:opacity-50 transition-colors">
                          승인
                        </button>
                        <button
                          onClick={() => rejectMutation.mutate(member.id)}
                          disabled={rejectMutation.isPending}
                          className="bg-red-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-600 disabled:opacity-50 transition-colors">
                          거절
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 전체 회원 목록 */}
      {tab === 'members' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="font-medium text-gray-800">전체 회원 목록</h3>
          </div>
          {membersLoading ? (
            <div className="py-20 text-center text-gray-400">불러오는 중...</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left font-medium text-gray-600">닉네임</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">이메일</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">지역</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">상태</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">권한</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">가입일</th>
                </tr>
              </thead>
              <tbody>
                {allMembers.map((member: any) => (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{member.nickname}</td>
                    <td className="px-4 py-3 text-gray-600">{member.email}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {member.state} {member.city}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        STATUS_LABEL[member.status]?.color || 'bg-gray-100 text-gray-600'
                      }`}>
                        {STATUS_LABEL[member.status]?.label || member.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        member.role === 'Admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {member.role === 'Admin' ? '관리자' : '일반'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(member.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}