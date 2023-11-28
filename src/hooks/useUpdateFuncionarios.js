
import axios from "axios";
import { format, parse } from "date-fns";


const updateFuncionarios = async (id, nome, cargo, salario, cpf, telefone, endereco, dtAdmissao, departamento, dataNascimento) => {
      try {
        const response = await axios.put(`https://pimbackend.onrender.com/funcionarios/${id}`, {
          nome,
          cargo,
          salario,
          cpf,
          telefone,
          endereco,
          dtAdmissao,
          departamento,
          dataNascimento,
        });
      } catch (error) {
        console.error("Erro ao enviar dados dos funcionários", error);
      }
    };


export default updateFuncionarios;
