import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { RegisterFuncForm } from 'src/sections/forms/register-func-form';

const Page = () => (
  <>
    <Head>
      <title>
        Cadastro de novo funcionário | iStorm RH
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <div>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={10}
                lg={11}
              >
                <RegisterFuncForm />
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
