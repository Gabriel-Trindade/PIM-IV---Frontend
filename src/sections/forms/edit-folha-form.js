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
import updateFolhaPagamento from "../../hooks/useUpdateFolha";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { format, parse, isValid } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { FolhasTable } from "../customer/folhas-table";

export const EditFolhas = ({ folha, onClose }) => {
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

  const formatData = (data) => {
    const Data = new Date(data);
    const dia = Data.getDate().toString().padStart(2, "0");
    const mes = (Data.getMonth() + 1).toString().padStart(2, "0");
    const ano = Data.getFullYear();
    return `${ano}-${mes}-${dia}`;
  };

  const formik = useFormik({
    initialValues: {
      imposto: folha.imposto,
      horasTrabalhadas: folha.horasTrabalhadas,
      bonus: folha.bonus,
      data_vigencia: formatData(folha.data_vigencia),
      submit: null,
    },

    validationSchema: Yup.object({
      imposto: Yup.number().max(100).required("Imposto em % é necessário."),
      horasTrabalhadas: Yup.number().required("Horas trabalhadas é necessário."),
      bonus: Yup.number().required("Bonus é necessário."),
      data_vigencia: Yup.string().transform((value, originalValue) => {
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

      // ... outras validações
    }),
    onSubmit: async (values, helpers) => {
      try {
        await updateFolhaPagamento(
          folha.id,
          folha.funcionario,
          values.imposto,
          values.horasTrabalhadas,
          values.bonus,
          values.data_vigencia
        );
        helpers.setStatus({ success: true });
        helpers.setErrors({ submit: "Folha criada com sucesso!" });
        helpers.setSubmitting(true);
        window.location.reload()
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
          subheader="Atualize as informações de acordo com o funcionário de seu departamento"
          title="Atualizar Folha de pagamento"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.nome && formik.errors.nome)}
                  fullWidth
                  helperText={formik.touched.nome && formik.errors.nome}
                  name="nome"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={folha.nomeFunc}
                  disabled={true}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.imposto && formik.errors.imposto)}
                  fullWidth
                  helperText={formik.touched.imposto && formik.errors.imposto}
                  label="Imposto (em %)"
                  name="imposto"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.imposto}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.horasTrabalhadas && formik.errors.horasTrabalhadas)}
                  fullWidth
                  helperText={formik.touched.horasTrabalhadas && formik.errors.horasTrabalhadas}
                  label="Horas Trabalhadas"
                  name="horasTrabalhadas"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.horasTrabalhadas}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.bonus && formik.errors.bonus)}
                  fullWidth
                  helperText={formik.touched.bonus && formik.errors.bonus}
                  label="Bônus"
                  name="bonus"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.bonus}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  error={!!(formik.touched.data_vigencia && formik.errors.data_vigencia)}
                  helperText={formik.touched.data_vigencia && formik.errors.data_vigencia}
                  type="date"
                  id="data_vigencia"
                  name="data_vigencia"
                  label="Data de Vigência"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.data_vigencia}
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
            Atualizar Folha
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
