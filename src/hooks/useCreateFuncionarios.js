
import axios from "axios";
import { format, parse } from "date-fns";


const registerFuncionarios = async (nome, cargo, salario, cpf, telefone, endereco, dtAdmissao, departamento, dataNascimento) => {
      try {
        const response = await axios.post(`https://pimbackend.onrender.com/funcionarios`, {
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


export default registerFuncionarios;
