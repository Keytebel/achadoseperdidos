
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Inicio() {
  const [itens, setItens] = useState([]);
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [categoria, setCategoria] = useState("");
  const [local, setLocal] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarItens() {
      try {
        const resposta = await api.get("/itens");
        const dados = resposta.data;
        setItens(Array.isArray(dados) ? dados : dados.itens || []);
      } catch (erro) {
        setErro(
          erro.response?.data?.detail ||
          "Não foi possível carregar os itens."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarItens();
  }, []);

  const categorias = [
    ...new Set(itens.map((item) => item.categoria).filter(Boolean))
  ];

  const locais = [
    ...new Set(itens.map((item) => item.local).filter(Boolean))
  ];

  const filtrados = itens.filter((item) => {
    const texto = busca.toLowerCase();

    return (
      ((item.nome || "").toLowerCase().includes(texto) ||
        (item.descricao || "").toLowerCase().includes(texto)) &&
      (!status || item.status === status) &&
      (!categoria || item.categoria === categoria) &&
      (!local || item.local === local)
    );
  });

  return (
    <section>
      <div className="titulo-pagina">
        <h2>Itens encontrados</h2>
        <Link className="botao" to="/novo">+ Novo item</Link>
      </div>

      <input
        placeholder="Buscar por nome ou descrição"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="filtros">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="aguardando">Aguardando</option>
          <option value="devolvido">Devolvido</option>
        </select>

        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Todas as categorias</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select value={local} onChange={(e) => setLocal(e.target.value)}>
          <option value="">Todos os locais</option>
          {locais.map((lugar) => (
            <option key={lugar} value={lugar}>{lugar}</option>
          ))}
        </select>
      </div>

      {carregando && <p>Carregando itens...</p>}
      {erro && <p className="erro">{erro}</p>}

      {!carregando && !erro && filtrados.length === 0 && (
        <p>Nenhum item encontrado.</p>
      )}

      <div className="lista">
        {filtrados.map((item) => (
          <article className="card-item" key={item.id}>
            <h3>{item.nome}</h3>
            <p>{item.descricao}</p>
            <p>Categoria: {item.categoria}</p>
            <p>Local: {item.local}</p>
            <p>Status: <strong>{item.status}</strong></p>
            <Link to={"/item/" + item.id}>Ver detalhes</Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Inicio;
