
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function Detalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [destinatario, setDestinatario] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  async function carregarItem() {
    try {
      const resposta = await api.get("/itens/" + id);
      setItem(resposta.data.item || resposta.data);
      setErro("");
    } catch (erro) {
      setErro(
        erro.response?.data?.detail || "Erro ao carregar o item."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarItem();
  }, [id]);

  async function devolver() {
    if (!destinatario.trim()) {
      setErro("Informe quem recebeu o item.");
      return;
    }

    try {
      await api.patch("/itens/" + id + "/devolver", {
        devolvido_para: destinatario
      });

      await carregarItem();
      setDestinatario("");
    } catch (erro) {
      setErro(
        erro.response?.data?.detail || "Erro ao registrar a devolução."
      );
    }
  }

  async function excluir() {
    if (!window.confirm("Deseja realmente excluir este item?")) return;

    try {
      await api.delete("/itens/" + id);
      navigate("/");
    } catch (erro) {
      setErro(
        erro.response?.data?.detail || "Erro ao excluir o item."
      );
    }
  }

  if (carregando) return <p>Carregando...</p>;
  if (!item) return <p className="erro">{erro || "Item não encontrado."}</p>;

  return (
    <article className="card-item">
      <h2>{item.nome}</h2>
      <p><strong>Descrição:</strong> {item.descricao}</p>
      <p><strong>Categoria:</strong> {item.categoria}</p>
      <p><strong>Local:</strong> {item.local}</p>
      <p><strong>Data encontrado:</strong> {item.data_encontrado}</p>
      <p><strong>Status:</strong> {item.status}</p>

      {item.status === "devolvido" && (
        <p><strong>Devolvido para:</strong> {item.devolvido_para}</p>
      )}

      {erro && <p className="erro">{erro}</p>}

      {item.status !== "devolvido" && (
        <div>
          <h3>Registrar devolução</h3>
          <input
            placeholder="Nome de quem recebeu"
            value={destinatario}
            onChange={(e) => setDestinatario(e.target.value)}
          />
          <button onClick={devolver}>Marcar como devolvido</button>
        </div>
      )}

      <div className="acoes">
        <Link className="botao" to={"/editar/" + item.id}>Editar</Link>
        <button className="excluir" onClick={excluir}>Excluir</button>
        <Link className="botao secundario" to="/">Voltar</Link>
      </div>
    </article>
  );
}

export default Detalhe;
