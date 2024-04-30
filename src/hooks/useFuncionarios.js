import { useState, useEffect } from 'react';
import axios from 'axios';


const useFuncionarios = () => {
    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);

    function formatarData(dataString) {
      const data = new Date(dataString);
      const dia = data.getDate().toString().padStart(2, '0');
      const mes = (data.getMonth() + 1).toString().padStart(2, '0');
      const ano = data.getFullYear();
  
      return `${dia}/${mes}/${ano}`;
  }
  
    useEffect(() => {
      const fetchFuncionarios = async () => {
        try {
          const departamentoId = localStorage.getItem('departamento');
          console.log(departamentoId);
          const response = await axios.get(`https://pimbackend.onrender.com/funcionarios/departamento/${departamentoId}`);
          const funcionariosList = typeof response.data === 'object' ? response.data : [response.data];
          funcionariosList.forEach((funcionario) => {
            funcionario.dtAdmissao = formatarData(funcionario.dtAdmissao);
          })
          setFuncionarios(funcionariosList);
          setLoading(false);
        } catch (error) {
          console.error('Erro ao buscar dados dos funcionários', error);
        }
      };
  
      fetchFuncionarios ();
    }, []);
  
    return { funcionarios, loading };
  };

  export default useFuncionarios;