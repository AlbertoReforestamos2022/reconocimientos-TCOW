import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'; 

// Páginas 
import Login from './pages/Login';
import Register from './pages/Register';
import Editor from './pages/Editor';

export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/editor' element={<Editor/>} />

        {/* Ruta raiz que reedirige al editor */}
        <Route path='/' element={ <Navigate to="/editor" replace />}/>

      </ Routes>
    </BrowserRouter>
  )
}