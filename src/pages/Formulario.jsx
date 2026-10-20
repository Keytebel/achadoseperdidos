
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function Formulario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [local, setLocal] = useState("");
  const [data, setData] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function carregarItem() {
      try {
        const resposta = await api.get("/itens/" + id);
        const item = resposta.data.item || resposta.data;

        setNome(item.nome || "");
        setDescricao(item.descricao || "");
        setCategoria(item.categoria || "");
        setLocal(item.local || "");
        setData(item.data_encontrado?.slice(0, 10) || "");
      } catch (erro) {
        setErro(
          erro.response?.data?.detail || "Erro ao carregar o item."
        );
      }
    }

    carregarItem();
  }, [id]);

  async function salvar(evento) {
    evento.preventDefault();

    try {
      setSalvando(true);
      setErro("");

      const dados = {
        nome,
        descricao,
        categoria,
        local,
        data_encontrado: data
      };

      if (editando) {
        await api.put("/itens/" + id, dados);
      } else {
        await api.post("/itens", dados);
      }

      navigate("/");
    } catch (erro) {
      setErro(
        erro.response?.data?.detail ||
        "Não foi possível salvar o item."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section>
      <h2>{editando ? "Editar item" : "Cadastrar item"}</h2>

      <form onSubmit={salvar}>
        <label>Nome do item</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} required />

        <label>Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />

        <label>Categoria</label>
        <input
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        />

        <label>Local</label>
        <input
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          required
        />

        <label>Data em que foi encontrado</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />

        {erro && <p className="erro">{erro}</p>}

        <button type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar"}
        </button>

        <button
          type="button"
          className="secundario"
          onClick={() => navigate("/")}
        >
          Cancelar
        </button>
      </form>
    </section>
  );
}

export default Formulario;

