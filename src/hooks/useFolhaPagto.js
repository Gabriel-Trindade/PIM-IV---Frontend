import { useState, useEffect } from "react";
import axios from "axios";
import { id } from "date-fns/locale";

const getFolhas = () => {
  const [folhasPagto, setFolhasPagto] = useState([]);
  const [loading, setLoading] = useState(true);

  function formatarData(dataString) {
    const data = new Date(dataString);
    const dia = data.getDate().toString().padStart(2, "0");
    const mes = (data.getMonth() + 1).toString().padStart(2, "0");
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
  }

  useEffect(() => {
    const fetchFolhasPagto = async () => {
      try {
        const departamentoId = localStorage.getItem("departamento");
        const tipo = localStorage.getItem("tipo");
        const usuario = localStorage.getItem("nome");
        console.log(departamentoId);
        if (tipo === "1") {
          const response = await axios.get(
            `https://pimbackend.onrender.com/folhas_pagamento/usuario/${usuario}`
          );
          const folhasList = typeof response.data === "object" ? response.data : [response.data];
          console.log(typeof response.data);
          folhasList.forEach((folhas) => {
            folhas.data_vigencia = formatarData(folhas.data_vigencia);
          });
          setFolhasPagto(folhasList);
          setLoading(false);
        } else {
          const response = await axios.get(
            `https://pimbackend.onrender.com/folhas_pagamento/departamento/${departamentoId}`
          );
          const folhasList = typeof response.data === "object" ? response.data : [response.data];
          console.log(typeof response.data);
          folhasList.forEach((folhas) => {
            folhas.data_vigencia = formatarData(folhas.data_vigencia);
          });
          setFolhasPagto(folhasList);
          setLoading(false);
        }

        console.log(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados dos funcionários", error);
      }
    };

    fetchFolhasPagto();
  }, []);

  return { folhasPagto, loading };
};

export default getFolhas;
