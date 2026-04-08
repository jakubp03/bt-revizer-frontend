import { Outlet, Route, Routes } from "react-router-dom";
import AuthHandler from "./components/handlers/AuthHandler";
import ProtectedRoute from "./components/handlers/ProtectedRoute";
import Layout from "./components/ui/Layout";
import LoginView from "./components/ui/views/auth/LoginView";
import RegisterView from "./components/ui/views/auth/RegisterView";
import HomeView from "./components/ui/views/HomeView";
import QuizResultView from "./components/ui/views/quiz/QuizResultView";
import QuizView from "./components/ui/views/quiz/QuizView";

export default function App() {
  return (
    <AuthHandler> {/*provides acces to token and handles token auth*/}
      <Routes>
        <Route path="/login" element={<LoginView />} /> {/* login page where user gets redirected if not authorized */}
        <Route path="/register" element={<RegisterView />} />
        <Route element={
          <ProtectedRoute>
            <Layout>
              <Outlet /> {/* child components, all child components are nested inside of ProtectedRoute => SocketProvider => Layout*/}
            </Layout>
          </ProtectedRoute>
        }>
          {/*here are child components to be rendered inside of outlet */}
          <Route path="/" element={<HomeView />} />
          <Route path="/quiz/:id" element={<QuizView />} />
          <Route path="/quiz/:id/results/:attemptId" element={<QuizResultView />} />
        </Route>
      </Routes>
    </AuthHandler>
  );
}
