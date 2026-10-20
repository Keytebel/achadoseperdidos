
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import api from "./services/api";
import Inicio from "./pages/Inicio";
import Detalhe from "./pages/Detalhe";
import Formulario from "./pages/Formulario";
import "./App.css";

function App() {
  const [aluno, setAluno] = useState("Aluno");

  useEffect(() => {
    async function carregarAluno() {
      try {
        const resposta = await api.get("/eu");
        setAluno(resposta.data.nome || "Aluno");
      } catch {
        setAluno("Aluno");
      }
    }

    carregarAluno();
  }, []);

  return (
    <BrowserRouter>
      <header className="cabecalho">
        <a href="/" className="logo">
          Achados e Perdidos IFRN
        </a>
        <p>Olá, {aluno}!</p>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/novo" element={<Formulario />} />
          <Route path="/item/:id" element={<Detalhe />} />
          <Route path="/editar/:id" element={<Formulario />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;

