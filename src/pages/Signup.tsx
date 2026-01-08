import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F4EF] px-6">
      {/* 1. 타이틀 */}
      <h1 className="text-2xl font-bold text-gray-800 mb-10">회원가입</h1>

      {/* 2. 입력 폼 */}
      <div className="w-full max-w-xs space-y-3">
        <input
          type="email"
          placeholder="이메일"
          className="w-full px-4 py-3 bg-white rounded-lg text-sm placeholder-gray-500 outline-none shadow-sm focus:ring-2 focus:ring-[#B4B998]/50 transition-all"
        />
        <input
          type="text"
          placeholder="닉네임"
          className="w-full px-4 py-3 bg-white rounded-lg text-sm placeholder-gray-500 outline-none shadow-sm focus:ring-2 focus:ring-[#B4B998]/50 transition-all"
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full px-4 py-3 bg-white rounded-lg text-sm placeholder-gray-500 outline-none shadow-sm focus:ring-2 focus:ring-[#B4B998]/50 transition-all"
        />

        {/* 3. 가입하기 버튼 */}
        <button
          className="w-full mt-8 py-3 bg-[#B4B998] text-white font-medium rounded-lg shadow-md hover:bg-[#A3A889] transition-colors"
          onClick={() => navigate("/login")} // 가입 후 로그인 페이지로 이동 (예시)
        >
          가입하기
        </button>
      </div>
    </div>
  );
}