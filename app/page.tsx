import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LandingPage from "./landing/page";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (token) {
    // Check user role from user_data cookie for role-based redirection
    const userDataCookie = cookieStore.get("user_data")?.value;
    let userRole = "user";
    
    if (userDataCookie) {
      try {
        const userData = JSON.parse(userDataCookie);
        userRole = userData.role || "user";
      } catch {
        // If parsing fails, default to user
        userRole = "user";
      }
    }

    if (userRole === "admin") {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  }

  // Show landing page for unauthenticated users
  return <LandingPage />;
}
