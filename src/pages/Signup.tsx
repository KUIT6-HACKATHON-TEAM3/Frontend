import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSignup = async () => {
    if(!email || !password || !nickname){
      alert("모든 정보를 입력해주세요.");
      return;
    }

    try{
      //[API]
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        email: email,
        password: password,
        nickname: nickname
      });

      console.log("회원가입 응답:", response.data);

      if(response.data.this.status === 201){
        alert("회원가입이 완료되었습니다! 로그인해주세요.");
        navigate("/login");
      }
    } catch (error: any) {
      console.error("회원가입 에러:", error);
      alert("회원가입에 실패했습니다.");
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

        <button
          className="w-full py-3 mt-8 font-medium text-white transition-colors rounded-lg shadow-md bg-primary-500 hover:bg-primary-900"
          onClick={() => navigate("/login")} // 가입 후 로그인 페이지로 이동 (예시)
        >
          가입하기
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