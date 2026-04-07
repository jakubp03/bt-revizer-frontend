import { Outlet, Route, Routes } from "react-router-dom";
import AuthHandler from "./components/handlers/AuthHandler";
import ProtectedRoute from "./components/handlers/ProtectedRoute";
import Login from "./components/ui/views/auth/LoginView";
import Register from "./components/ui/views/auth/RegisterView";
import QuizResultView from "./components/ui/views/quiz/QuizResultView";
import QuizView from "./components/ui/views/quiz/QuizView";
import DefaultView from "./DefaultView";

export default function App() {
  return (
    <AuthHandler> {/*provides acces to token and handles token auth*/}
      <Routes>
        <Route path="/login" element={<Login />} /> {/* login page where user gets redirected if not authorized */}
        <Route path="/register" element={<Register />} />
        <Route element={
          <ProtectedRoute>
            <Outlet /> {/* child components, all child components are nested inside of ProtectedRoute => SocketProvider => Layout*/}
          </ProtectedRoute>
        }>
          {/*here are child components to be rendered inside of outlet */}
          <Route path="/" element={<DefaultView />} />
          <Route path="/quiz/:id" element={<QuizView />} />
          <Route path="/quiz/:id/results/:attemptId" element={<QuizResultView />} />
        </Route>
      </Routes>
    </AuthHandler>
  );
}
