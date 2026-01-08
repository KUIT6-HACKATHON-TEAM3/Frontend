import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// import MapPage from "./pages/MapPage";

function MapPage() {
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.reload();
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">지도 화면 (로그인 상태)</h1>
      <p className="mb-8">자동 로그인이 잘 작동 중입니다.</p>
      
      {/* 이 버튼을 누르면 다시 로그인 화면으로 갑니다 */}
      <button 
        onClick={handleLogout}
        className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600"
      >
        로그아웃 (토큰 삭제)
      </button>
    </div>
  )
}

function PrivateRoute({ children }: { children: JSX.Element }) {
  // 로컬 스토리지에 토큰이 있는지 확인
  const token = localStorage.getItem("accessToken");
  
  // 토큰 있으면 통과(children), 없으면 로그인 페이지로 이동
  return token ? children : <Navigate to="/login" replace />;
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>

        <Route
          path="/"
          element={
            <PrivateRoute>
              <MapPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
