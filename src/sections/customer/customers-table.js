import PropTypes from "prop-types";
import * as React from 'react';
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
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { EditFunc } from 'src/sections/forms/edit-func-form';
import { useState, useEffect } from "react";

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
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const deleteFunc = async (id) => {
  const response = await axios.delete(`https://pimbackend.onrender.com/funcionarios/${id}`);
  if (response.status === 200) {
    alert("Funcionário deletado com sucesso!");
    window.location.reload();
  }
};



const fillFunc = async (id) => {
  try {
    const response = await axios.get(`https://pimbackend.onrender.com/funcionarios/${id}`);
    if (response.status === 200) {
      return response.data; // Retorna os dados do funcionário
    }
  } catch (error) {
    console.error("Erro ao obter dados do funcionário", error);
    return null;
  }
}

export const CustomersTable = (props) => {
  const [editingFuncionario, setEditingFuncionario] = React.useState(null);

  const editarFunc = async (id) => {
    try {
      const data = await fillFunc(id);
      if (data) {
        setEditingFuncionario(data);
        handleOpen(); // Abre o modal ao obter os dados do funcionário
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

  const [searchQuery, setSearchQuery] = useState('');
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
        <Box sx={{ minWidth: 800 }}>
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
                <TableCell>Cargo</TableCell>
                <TableCell>Departamento</TableCell>
                <TableCell>Celular</TableCell>
                <TableCell>Registrado em</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((funcionario) => {
                const isSelected = selected.includes(funcionario.id);
                const createdAt = funcionario.dtAdmissao;

                var userDepartamento = funcionario.departamento;
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
                  <TableRow hover key={funcionario.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(funcionario.id);
                          } else {
                            onDeselectOne?.(funcionario.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">{funcionario.nome}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{funcionario.cargo}</TableCell>
                    <TableCell>{`${userDepartamentoId}`}</TableCell>
                    <TableCell>{funcionario.telefone}</TableCell>
                    <TableCell>{createdAt}</TableCell>
                    <ThemeProvider theme={theme}>
                      <TableCell>
                        <Button
                          type="button"
                          variant="contained"
                          color="warning"
                          onClick={() => editarFunc(funcionario.id)}
                        >
                          Editar
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="contained"
                          color="danger"
                          onClick={() => deleteFunc(funcionario.id)}
                        >
                          Deletar
                        </Button>
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
        <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={10}
                lg={11}
              >
                <EditFunc funcionario={editingFuncionario} onClose={handleClose} />
              </Grid>
            </Grid>
            </Box>
      </Modal>
    </Card>
  );
};

CustomersTable.propTypes = {
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
