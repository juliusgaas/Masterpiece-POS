import { Outlet } from "react-router-dom";
import Header from "./Header/header";
import { jwtDecode } from "jwt-decode";

interface UserToken {
    id: number;
    username: string;
    fullname: string;
    role: string;
    exp: number;
}

function MainLayout() {
    const token = localStorage.getItem("token");
    let user: UserToken | null = null;
    if (token) {
        user = jwtDecode<UserToken>(token);
    }
    const initials = (user?.username ?? "")
        .split(" ")
        .filter(Boolean)
        .map(name => name.charAt(0).toUpperCase())
        .join("");
        
  return (
    <>
       <Header
            online={true}
            username={user?.username ?? ""}
            initials={initials}
            terminal="Terminal 01"
        />

      <main>
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;