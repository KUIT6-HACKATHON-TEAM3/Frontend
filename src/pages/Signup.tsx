import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { authApi } from "../api/auth";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if(!email || !password || !nickname){
      alert("모든 정보를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try{
      //[API]
      const response = await authApi.signup({
        email,
        password,
        nickname
      });

      console.log("회원가입 응답:", response.data);
      
      alert("회원가입이 완료되었습니다! 로그인해주세요.");
      navigate("/login");
      
    } catch (error: any) {
      console.error("회원가입 에러:", error);
      alert("회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F4EF] px-6">
      {/* 1. 타이틀 */}
      <h1 className="mb-10 text-2xl font-bold text-gray-800">회원가입</h1>

      {/* 2. 입력 폼 */}
      <div className="w-full max-w-xs space-y-3">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-white rounded-lg text-sm placeholder-gray-500 outline-none shadow-sm focus:ring-2 focus:ring-[#B4B998]/50 transition-all"
        />
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full px-4 py-3 bg-white rounded-lg text-sm placeholder-gray-500 outline-none shadow-sm focus:ring-2 focus:ring-[#B4B998]/50 transition-all"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-white rounded-lg text-sm placeholder-gray-500 outline-none shadow-sm focus:ring-2 focus:ring-[#B4B998]/50 transition-all"
        />

        <button
          onClick={handleSignup}
          disabled={isLoading}
          className="w-full py-3 mt-8 font-medium text-white transition-colors rounded-lg shadow-md bg-primary-500 hover:bg-primary-900"
        >
          {isLoading ? "가입 중..." : "가입하기"}
        </button>
        <button 
          onClick={() => navigate("/login")}
          className="w-full mt-4 text-sm text-gray-400 underline hover:text-gray-600"
        >
          로그인으로 돌아가기
        </button>
      </div>
    </div>
  );
}