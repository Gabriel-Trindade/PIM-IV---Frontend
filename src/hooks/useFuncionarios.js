import { useState, useEffect } from 'react';
import axios from 'axios';


const useFuncionarios = () => {
    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchFuncionarios = async () => {
        try {
          const response = await axios.get('http://localhost:4000/funcionarios');
          setFuncionarios(response.data);
          setLoading(false);
          console.log(response.data)
        } catch (error) {
          console.error('Erro ao buscar dados dos funcionários', error);
        }
      };
  
      fetchFuncionarios ();
    }, []);
  
    return { funcionarios, loading };
  };

  export default useFuncionarios;