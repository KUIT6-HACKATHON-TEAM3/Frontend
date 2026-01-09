import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/icons/logo.png"
import { authApi } from "../api/auth";


export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!email || !password) {
            alert("이메일과 비밀번호를 모두 입력해주세요.");
            return;
        }

        setIsLoading(true);

        try{
            // [API]
            // 로그인 요청
            await authApi.login({ email, password });
            navigate("/", {replace: true});
        } catch (error: any){
            console.error("로그인 실패:", error);
            alert("아이디 또는 비밀번호가 일치하지 않습니다.");
        } finally{
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F4EF] px-6">
        {/* 1. 앱 로고 */}
        <img 
            src={logoImg} 
            alt="앱 로고" 
            className="object-contain w-16 mb-10" 
        />
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
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white rounded-lg text-sm placeholder-gray-500 outline-none shadow-sm focus:ring-2 focus:ring-[#B4B998]/50 transition-all"
            />
    
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-4 font-medium text-white transition-colors rounded-lg shadow-md bg-primary-500 hover:bg-primary-900"
                onClick={handleLogin}
            >
            {isLoading ? "로그인 중..." : "로그인"}
            </button>

            <div className="flex justify-end mt-2">
                <button
                    onClick={() => navigate("/signup")}
                    className="text-xs text-gray-500 hover:text-gray-700 hover:underline"
                >
                    회원가입
                </button>
            </div>
        </div>
    </div>
    );
}