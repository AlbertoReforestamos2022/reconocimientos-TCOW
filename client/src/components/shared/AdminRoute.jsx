import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";


export default function AdminRoute() {
    const user = useAuthStore((s) => s.user);
    const token = useAuthStore((s) => s.token); 

    if(!token) return <Navigate to="/login" replace/>
    if(user?.role !== 'admin') return <Navigate to="/editor" replace/>

    return <Outlet/>
}