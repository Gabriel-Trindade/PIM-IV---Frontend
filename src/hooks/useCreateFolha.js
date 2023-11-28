
import axios from "axios";
import { format, parse } from "date-fns";


const CreateFolhaPagto = async (funcionario, imposto, horasTrabalhadas, bonus, data_vigencia, usuario) => {
      try {
        const response = await axios.post(`https://pimbackend.onrender.com/folhas_pagamento`, {
            funcionario,
            imposto,
            horasTrabalhadas,
            bonus,
            data_vigencia,
            usuario
        });
      } catch (error) {
        console.error("Erro ao enviar dados dos funcionários", error);
      }
    };


export default CreateFolhaPagto;
