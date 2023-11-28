import { useCallback, useState } from "react";
import {
  Box,
  DatePicker,
  Button,
  Card,
  Link,
  Stack,
  Typography,
  Autocomplete,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { useFormik, Field, FieldArray } from "formik";
import * as Yup from "yup";
import InputMask from "react-input-mask";
import registerFuncionario from "../../hooks/useCreateFuncionarios";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { format, parse, isValid } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";


export const RegisterFuncForm = () => {


  var userDepartamento = localStorage.getItem("departamento");
  var userDepartamentoId = "";
  switch (parseInt(userDepartamento, 10)) {
    case 1:
      userDepartamentoId = "Operacional";
      break;
    case 2:
      userDepartamentoId = "Gestão";
      break;
    case 3:
      userDepartamentoId = "Administrativo";
      break;
    case 4:
      userDepartamentoId = "RH";
      break;
    default:
      // Lidar com valores não previstos, se necessário
      break;
  }


  const formik = useFormik({
    initialValues: {
      nome: "",
      cargo: "",
      salario: "",
      cpf: "",
      telefone: "",
      endereco: "",
      dataNascimento: "",
      dtAdmissao: "",
      submit: null,
    },

    validationSchema: Yup.object({
      cargo: Yup.string().max(255).required("Cargo é necessário."),
      salario: Yup.string().max(255).required("Salário é necessário."),
      nome: Yup.string().max(255).required("Nome é necessário."),
      cpf: Yup.string().max(255).required("CPF é necessário."),
      telefone: Yup.string().max(255).required("Telefone é necessário."),
      endereco: Yup.string().max(255).required("Endereco é necessário."),
      dataNascimento: Yup.string().transform((value, originalValue) => {
        if (!originalValue) return "";

        const [day, month, year] = originalValue.split("/");
        const parsedDate = new Date(`${day}${month}${year}`);

        if (!isNaN(parsedDate.getTime())) {
          // Se a data é válida, convertemos para o formato desejado
          const formattedDate = `${day}/${month}/${year}`;
          return formattedDate;
        }

        return "";
      }),
      dtAdmissao: Yup.string().max(255).required("Data de admissão é necessária."),

      // ... outras validações
    }),
    onSubmit: async (values, helpers) => {
      try {
        var userDepartamento = localStorage.getItem("departamento");
        await registerFuncionario(
          values.nome,
          values.cargo,
          parseFloat(values.salario),
          values.cpf,
          values.telefone,
          values.endereco,
          values.dtAdmissao,
          userDepartamento,
          values.dataNascimento
        );
        console.log(values, userDepartamento);
        helpers.setStatus({ success: true });
        helpers.setErrors({ submit: "Funcionario registrado com sucesso!" });
        helpers.setSubmitting(true);
      } catch (err) {
        console.log(err);
        // If an error occurs during sign-up, handle the error
        if (err.response && err.response.data) {
          // Use the server-provided error message
          helpers.setErrors({ submit: err.response.data });
        } else {
          // Use a default error message or log the error for debugging
          helpers.setErrors({ submit: "Erro desconhecido" });
          console.error(err);
        }
        if (!values.departamento) {
          helpers.setErrors({ submit: "Escolha um departamento válido." });
          return;
        }

        // Update other form-related state if needed
        helpers.setStatus({ success: false });
        helpers.setSubmitting(false);
      }
    },
  });

  const formatToBrDate = (date) => {
    return format(date, "dd/MM/yyyy");
  };

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader
          subheader="Preencha as informações de acordo com o funcionário de seu departamento"
          title="Registrar novo Funcionário"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.nome && formik.errors.nome)}
                  fullWidth
                  helperText={formik.touched.nome && formik.errors.nome}
                  label="Nome"
                  name="nome"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.nome}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.cargo && formik.errors.cargo)}
                  fullWidth
                  helperText={formik.touched.cargo && formik.errors.cargo}
                  label="Cargo"
                  name="cargo"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.cargo}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.salario && formik.errors.salario)}
                  fullWidth
                  helperText={formik.touched.salario && formik.errors.salario}
                  label="Salário"
                  name="salario"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.salario}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.cpf && formik.errors.cpf)}
                  fullWidth
                  helperText={formik.touched.cpf && formik.errors.cpf}
                  label="CPF"
                  name="cpf"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.cpf}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.telefone && formik.errors.telefone)}
                  fullWidth
                  helperText={formik.touched.telefone && formik.errors.telefone}
                  label="Telefone"
                  name="telefone"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.telefone}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.endereco && formik.errors.endereco)}
                  fullWidth
                  helperText={formik.touched.endereco && formik.errors.endereco}
                  label="Endereço"
                  name="endereco"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.endereco}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  error={!!(formik.touched.dataNascimento && formik.errors.dataNascimento)}
                  helperText={formik.touched.dataNascimento && formik.errors.dataNascimento}
                  type="date"
                  id="dataNascimento"
                  name="dataNascimento"
                  label="Data de nascimento"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.dataNascimento}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                 fullWidth
                 error={!!(formik.touched.dtAdmissao && formik.errors.dtAdmissao)}
                 helperText={formik.touched.dtAdmissao && formik.errors.dtAdmissao}
                 type="date"
                 id="dtAdmissao"
                 name="dtAdmissao"
                 label="Data de admissão"
                 onBlur={formik.handleBlur}
                 onChange={formik.handleChange}
                 value={formik.values.dtAdmissao}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Departamento"
                  name="departamento"
                  onChange={formik.handleChange}
                  disabled={true}
                  value={userDepartamentoId}
                />
              </Grid>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              {!formik.errors.submit && (
                <Typography color="#10B981" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained" type="submit">
            Salvar Funcionário
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
