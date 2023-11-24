import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { Layout as AuthLayout } from "src/layouts/auth/layout";

const RegistroForm = () => {
  const authContext = useAuthContext();
  const [dadosFormulario, setDadosFormulario] = useState({
    nome: "",
    tipo: 1,
    departamento: 1,
    senha: "",
  });
};

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      password: "",
      submit: null,
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Insira um email válido.")
        .max(255)
        .required("Preencha com um email."),
      password: Yup.string().max(255).required("Senha é necessária."),
      name: Yup.string().max(255).required("Nome é necessário."),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await auth.signUpAdmin(values.email, values.name, values.password, 2, 1);
        console.log(values);
        helpers.setStatus({ success: true });
        helpers.setErrors({ submit: "Registrado com sucesso!" });
        helpers.setSubmitting(true);
      } catch (err) {
        console.log(err)
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

  return (
    <>
      <Head>
        <title>Registrar | iStorm RH</title>
      </Head>
      <Box
        sx={{
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Registrar</Typography>
              <Typography color="text.secondary" variant="body2">
                Já possui uma conta? &nbsp;
                <Link component={NextLink} href="/auth/login" underline="hover" variant="subtitle2">
                  Login
                </Link>
              </Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Nome"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Endereço de email"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Senha"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
              </Stack>
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
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                Continue
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
