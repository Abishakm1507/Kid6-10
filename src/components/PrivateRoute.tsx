import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import MainLayout from '../layouts/MainLayout';

const PrivateRoute = () => {
  const { isLoggedIn, onboardingCompleted } = useUserStore();
  
  // If user is not logged in, redirect to get started page
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }
  
  // If onboarding is not completed and trying to access a page other than onboarding
  if (!onboardingCompleted && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" />;
  }

  // Wrap all authenticated routes in the main layout
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default PrivateRoute;