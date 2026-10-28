import { AppRouter } from "./routes/AppRouter"
import { UserProvider } from "./users/contexts/UserContext";

export const HomiesApp = () => {
  return (
    <UserProvider>
      <AppRouter />
    </UserProvider>
  )
};