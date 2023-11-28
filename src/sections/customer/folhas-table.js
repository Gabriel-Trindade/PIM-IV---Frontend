import PropTypes from "prop-types";
import * as React from "react";
import { format } from "date-fns";
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  SvgIcon,
  Unstable_Grid2 as Grid,
  Tab,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { EditFolhas } from "src/sections/forms/edit-folha-form";
import { CreateFolha } from "src/sections/forms/create-folha-form";
import { useState, useEffect } from "react";
import Lupa from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";
import { GetFolhaPagamento } from "../forms/get-folha-form";

// Criar um tema personalizado
const theme = createTheme({
  palette: {
    warning: {
      lightest: "#FFFAEB",
      light: "#FEF0C7",
      main: "#F79009",
      dark: "#B54708",
      darkest: "#7A2E0E",
      contrastText: "#FFFFFF",
    },
    danger: {
      lightest: "#FEF3F2",
      light: "#FEE4E2",
      main: "#F04438",
      dark: "#B42318",
      darkest: "#7A271A",
      contrastText: "#FFFFFF",
    },
  },
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const deleteFolha = async (id) => {
  const response = await axios.delete(`https://pimbackend.onrender.com/folhas_pagamento/${id}`);
  if (response.status === 200) {
    alert("Funcionário deletado com sucesso!");
    window.location.reload();
  }
};

const fillFolha = async (id) => {
  try {
    const response = await axios.get(`https://pimbackend.onrender.com/folhas_pagamento/${id}`);
    if (response.status === 200) {
      return response.data; // Retorna os dados do funcionário
    }
  } catch (error) {
    console.error("Erro ao obter dados da folha", error);
    return null;
  }
};

export const FolhasTable = (props) => {
  const [editingFolhas, setEditingFolhas] = React.useState(null);
  const [GettingFolha, setGettingFolha] = React.useState(null);

  const editarFolha = async (id) => {
    try {
      const data = await fillFolha(id);
      if (data) {
        setEditingFolhas(data);
        handleOpen(); // Abre o modal ao obter os dados do funcionário
      }
    } catch (error) {
      console.error("Erro ao preencher os dados do funcionário para edição", error);
    }
  };

  const getFolha = async (id) => {
    try {
      const data = await fillFolha(id);
      if (data) {
        setGettingFolha(data);
        handleOpenFolha(); // Abre o modal ao obter os dados do funcionário
      }
    } catch (error) {
      console.error("Erro ao preencher os dados do funcionário para edição", error);
    }
  };

  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openFolha, setOpenFolha] = React.useState(false);
  const handleOpenFolha = () => setOpenFolha(true);
  const handleCloseFolha = () => setOpenFolha(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(props.items);

  useEffect(() => {
    // Quando a consulta de pesquisa muda, filtre os itens
    const filtered = searchQuery
      ? props.items.filter((funcionario) =>
          funcionario.nome.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : props.items;

    setFilteredItems(filtered);
  }, [searchQuery, props.items]);

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 1000 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Imposto</TableCell>
                <TableCell>Valor do Imposto</TableCell>
                <TableCell>Departamento</TableCell>
                <TableCell>Horas Trabalhadas</TableCell>
                <TableCell>Bônus</TableCell>
                <TableCell>Valor Bruto</TableCell>
                <TableCell>Valor Líquido</TableCell>
                <TableCell>Data de vigência</TableCell>
                {localStorage.getItem("tipo") === "2" && (
                  <>
                    <TableCell>Editar</TableCell>
                    <TableCell>Excluir</TableCell>
                  </>
                )}
                <TableCell>Visualizar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((folhas) => {
                const isSelected = selected.includes(folhas.id);
                const createdAt = folhas.data_vigencia;

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

                return (
                  <TableRow hover key={folhas.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(folhas.id);
                          } else {
                            onDeselectOne?.(folhas.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={1}>
                        <Typography variant="subtitle2">{folhas.nomeFunc}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{`${folhas.imposto} %`}</TableCell>
                    <TableCell>{`R$ ${folhas.vlImposto}`}</TableCell>
                    <TableCell>{`${userDepartamentoId}`}</TableCell>
                    <TableCell>{`${folhas.horasTrabalhadas} hrs`}</TableCell>
                    <TableCell>{`R$ ${folhas.bonus}`}</TableCell>
                    <TableCell>{`R$ ${folhas.salario}`}</TableCell>
                    <TableCell>{`R$ ${folhas.recebimento}`}</TableCell>
                    <TableCell>{createdAt}</TableCell>
                    {localStorage.getItem("tipo") === "2" && (
                      <>
                        <ThemeProvider theme={theme}>
                          <TableCell>
                            <Button
                              startIcon={
                                <SvgIcon fontSize="small">
                                  <PencilSquareIcon />
                                </SvgIcon>
                              }
                              type="button"
                              variant="contained"
                              color="warning"
                              onClick={() => editarFolha(folhas.id)}
                            ></Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              startIcon={
                                <SvgIcon fontSize="small">
                                  <TrashIcon />
                                </SvgIcon>
                              }
                              type="button"
                              variant="contained"
                              color="danger"
                              onClick={() => deleteFolha(folhas.id)}
                            ></Button>
                          </TableCell>
                        </ThemeProvider>
                      </>
                    )}
                    <ThemeProvider theme={theme}>
                      <TableCell>
                        <Button
                          startIcon={
                            <SvgIcon fontSize="small">
                              <Lupa />
                            </SvgIcon>
                          }
                          variant="contained"
                          onClick={() => getFolha(folhas.id)}
                        ></Button>
                      </TableCell>
                    </ThemeProvider>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid container spacing={3}>
            <Grid xs={12} md={10} lg={11}>
              <EditFolhas folha={editingFolhas} onClose={handleClose} />
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Modal
        open={openFolha}
        onClose={handleCloseFolha}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid container spacing={3}>
            <Grid xs={12} md={10} lg={11}>
              <GetFolhaPagamento folha={GettingFolha} onClose={handleCloseFolha} />
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Card>
  );
};

FolhasTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
