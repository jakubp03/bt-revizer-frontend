import { Outlet, Route, Routes } from "react-router-dom";
import AuthHandler from "./components/handlers/AuthHandler";
import InitializationHandler from "./components/handlers/InitializationHandler";
import ProtectedRoute from "./components/handlers/ProtectedRoute";
import Layout from "./components/ui/Layout";
import LoginView from "./components/ui/views/auth/LoginView";
import RegisterView from "./components/ui/views/auth/RegisterView";
import CategoryCreationView from "./components/ui/views/category/CategoryCreationView";
import CategoryDetailView from "./components/ui/views/category/CategoryDetailView";
import HomeView from "./components/ui/views/HomeView";
import LibraryView from "./components/ui/views/library/LibraryView";
import QuizCreationView from "./components/ui/views/quiz/create/QuizCreationView";
import QuizResultView from "./components/ui/views/quiz/play/QuizResultView";
import QuizView from "./components/ui/views/quiz/play/QuizView";
import QuizDetailView from "./components/ui/views/quiz/QuizDetailView";

export default function App() {
  return (
    <AuthHandler> {/*provides acces to token and handles token auth*/}
      <Routes>
        <Route path="/login" element={<LoginView />} /> {/* login page where user gets redirected if not authorized */}
        <Route path="/register" element={<RegisterView />} />
        <Route element={
          <ProtectedRoute>
            <InitializationHandler>
              <Outlet />
            </InitializationHandler>
          </ProtectedRoute>
        }>
          {/* Routes WITH sidebar layout */}
          <Route element={<Layout><Outlet /></Layout>}>
            <Route path="/" element={<HomeView />} />
            <Route path="/library" element={<LibraryView />} />
            <Route path="/quiz/create" element={<QuizCreationView />} />
            <Route path="/category/create" element={<CategoryCreationView />} />
            <Route path="/category/:id" element={<CategoryDetailView />} />
            <Route path="/quiz/:id" element={<QuizDetailView />} />
            <Route path="/quiz/:id/results/:attemptId" element={<QuizResultView />} />
          </Route>
          {/* Routes WITHOUT sidebar layout */}
          <Route path="/quiz/:id/play" element={<QuizView />} />
        </Route>
      </Routes>
    </AuthHandler>
  );
}
