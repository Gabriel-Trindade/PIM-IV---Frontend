import { useCallback, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { FolhasTable } from 'src/sections/customer/folhas-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { applyPagination } from 'src/utils/apply-pagination';
import getFolhas from 'src/hooks/useFolhaPagto';

const now = new Date();




const useFolhas = (folhas, page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(folhas, page, rowsPerPage);
    },
    [folhas,page, rowsPerPage]
  );
};

const useFolhasIds = (folhas) => {
  return useMemo(
    () => {
      return folhas.map((folhas) => folhas.id);
    },
    [folhas]
  );
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { folhasPagto, loading } = getFolhas();
  const folhas = useFolhas(folhasPagto, page, rowsPerPage);
  const folhasIds = useFolhasIds(folhasPagto);
  const folhasSelection = useSelection(folhasIds);
  
  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  return (
    <>
      <Head>
        <title>
          Folhas de Pagamento | iStorm RH
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Folhas de Pagamento
                </Typography>
              </Stack>
              <div>
              </div>
            </Stack>
            <CustomersSearch />
            <FolhasTable
              count={folhas.length}
              items={applyPagination(folhas, page, rowsPerPage)}
              onDeselectAll={folhasSelection.handleDeselectAll}
              onDeselectOne={folhasSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={folhas.handleSelectAll}
              onSelectOne={folhas.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={folhas.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
