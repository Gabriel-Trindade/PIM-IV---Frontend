import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import { SvgIcon } from "@mui/material";


export default function getItemsByType() {
  const tipo = localStorage.getItem("tipo");

  if (tipo === "1") {
    return [
      {
        title: "Folhas de Pagamento",
        path: "/folhas",
        icon: (
          <SvgIcon fontSize="small">
            <ShoppingBagIcon />
          </SvgIcon>
        ),
      },
    ];
  } else if (tipo === "2") {
    return [
      {
        title: "Funcionários",
        path: "/funcionarios",
        icon: (
          <SvgIcon fontSize="small">
            <UsersIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Folhas de Pagamento",
        path: "/folhas",
        icon: (
          <SvgIcon fontSize="small">
            <ShoppingBagIcon />
          </SvgIcon>
        ),
      },
      // {
      //   title: "Ajustes",
      //   path: "/settings",
      //   icon: (
      //     <SvgIcon fontSize="small">
      //       <CogIcon />
      //     </SvgIcon>
      //   ),
      // },
      {
        title: "Cadastrar Login Funcionário",
        path: "/auth/registerFunc",
        icon: (
          <SvgIcon fontSize="small">
            <UserPlusIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Cadastrar Novo Usuário",
        path: "/auth/register",
        icon: (
          <SvgIcon fontSize="small">
            <UserPlusIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Cadastrar Novo Funcionário",
        path: "/registernewFunc",
        icon: (
          <SvgIcon fontSize="small">
            <UserPlusIcon />
          </SvgIcon>
        ),
      },
    ];
  }

  // Return an empty array or handle other cases if needed
  return [];
}