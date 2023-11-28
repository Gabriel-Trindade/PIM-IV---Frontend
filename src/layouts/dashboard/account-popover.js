import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Popover, Box, Typography, Divider, MenuList, MenuItem } from "@mui/material";
import { useAuth } from "../../hooks/use-auth";
import { useAuthContext } from "../../contexts/auth-context";

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open } = props;
  const router = useRouter();
  const auth = useAuth();
  const { getUserInfo } = useAuthContext();

  // Inicialize userInfo com um objeto vazio para evitar problemas iniciais
  const [userInfo, setUserInfo] = useState({});

  // Use um useEffect para atualizar userInfo ao montar o componente
  useEffect(() => {
    const nome = localStorage.getItem("nome");
    setUserInfo({ nome: String(nome) });
  }, []); // Apenas executa uma vez durante a montagem do componente

  const handleSignOut = () => {
    onClose?.();
    auth.signOut();
    router.push("/auth/login");
  };

  // Evite chamar setUserInfo diretamente no evento onClick para evitar atualizações em loop
  const handleSignOutClick = () => {
    handleSignOut();
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        {userInfo.nome ? (
          <>
            <Typography color="text.secondary" variant="body2">
              Nome: {userInfo.nome}
            </Typography>
          </>
        ) : (
          <Typography color="text.secondary" variant="body2">
            Usuário não autenticado
          </Typography>
        )}
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: "8px",
          "& > *": {
            borderRadius: 1,
          },
        }}
      >
        <MenuItem onClick={handleSignOutClick}>Sair</MenuItem>
      </MenuList>
    </Popover>
  );
};
