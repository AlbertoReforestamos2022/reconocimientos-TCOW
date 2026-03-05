import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

// Páginas
import Login from './pages/Login';
import Register from './pages/Register';
import Editor from './pages/Editor';
import AdminLayout from './pages/admin/adminLayout';
import States from './pages/admin/states';
import Cities from './pages/admin/Cities';
import Users from './pages/admin/Users';

// Guards
import AdminRoute from './components/shared/AdminRoute';

export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/editor' element={<Editor/>} />

        {/* Rutas admin protegidas */}
        <Route element={<AdminRoute />}>
          <Route path='/admin' element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/states" replace />} />
            <Route path='states' element={<States />} />
            <Route path='cities' element={<Cities />} />
            <Route path='users' element={<Users />} />
          </Route>
        </Route>

        {/* Ruta raiz que reedirige al editor */}
        <Route path='/' element={ <Navigate to="/editor" replace />}/>

      </ Routes>
    </BrowserRouter>
  )
}