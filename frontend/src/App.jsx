import Home from './pages/Home';
import Login from './pages/Login';
import Editais from './pages/Editais';
import PaginaUsuario from './pages/PaginaUsuario';
import EditalEspecifico from './pages/EditalEspecifico';
import EditaisValidados from './pages/EditaisValidados';
import SugerirEdital from './pages/SugerirEditais';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
     // 1. BrowserRouter envolve toda a aplicação para gerenciar as URLs.
    <BrowserRouter>
        
        {/* 3. Routes olha a URL atual e decide qual Route renderizar. */}
        <Routes>
          
          {/* 4. Cada Route define uma "regra": um caminho (path) e o componente (element) a ser mostrado. */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/editais" element={<Editais />} />
          <Route path="/editais-validados" element={<EditaisValidados />} />
          <Route path="/sugerir" element={<SugerirEdital />} />
          <Route path="/meu-perfil" element={<PaginaUsuario />} />
          
          {/* ROTA DINÂMICA: O ':id' é um parâmetro. 
              Qualquer URL como /editais/123 ou /editais/abc irá corresponder a esta rota.
              O componente EditalEspecifico pode então pegar esse 'id' usando o hook useParams(). */}
          <Route path="/editais/:id" element={<EditalEspecifico />} />

          {/* Você pode adicionar uma rota "catch-all" para páginas não encontradas */}
          <Route path="*" element={<h1>Página Não Encontrada</h1>} />

        </Routes>
    </BrowserRouter>
  )
}

export default App;