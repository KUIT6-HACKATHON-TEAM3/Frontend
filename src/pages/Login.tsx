import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // npm install axios
import logoImg from "../assets/logo.png"

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
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                email: email,       
                password: password  
            });

            console.log("로그인 응답:", response.data);

            const { accessToken, nickname } = response.data.data;

            if (accessToken) {
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("nickname", nickname);
                
                alert(`${nickname}님 환영합니다!`);

                navigate("/", {replace: true});
            } else{
                alert("토큰 없음. 백엔드 확인 요청");
            }

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
                className="w-full mt-4 py-3 bg-primary-500 text-white font-medium rounded-lg shadow-md hover:bg-[#A3A889] transition-colors"
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