
import axios from "axios";
import { format, parse } from "date-fns";


const updateFolhaPagamento = async (id,funcionario, imposto, horasTrabalhadas, bonus, data_vigencia) => {
      try {
        const response = await axios.put(`https://pimbackend.onrender.com/folhas_pagamento/${id}`, {
          funcionario,
          imposto,
          horasTrabalhadas,
          bonus,
          data_vigencia,
        });
      } catch (error) {
        console.error("Erro ao enviar dados dos funcionários", error);
      }
    };


export default updateFolhaPagamento;
