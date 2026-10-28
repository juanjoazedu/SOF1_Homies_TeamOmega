import { AppRouter } from "./routes/AppRouter"
import { UserProvider } from "./users/contexts/UserContext";
import { FollowersPage } from "./users/pages/FollowersPage";
import { FollowingPage } from "./users/pages/FollowingPage";

export const HomiesApp = () => {
  return (
    <UserProvider>
      <FollowersPage />
      <FollowingPage />
      <AppRouter />
    </UserProvider>
  )
};