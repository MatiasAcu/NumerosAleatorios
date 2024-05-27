import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Bingo from "./pages/Bingo";
import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import SlotMachine from "./pages/SlotMachine";
import CoinGame from "./pages/CoinGame";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Bingo></Bingo>,
    },
    {
      path: "/bingo",
      element: <Bingo></Bingo>,
    },
    {
      path: "/maquinita",
      element: <SlotMachine />,
    },
    {
      path: "/moneda",
      element: <CoinGame />,
    },
  ],
  {
    basename: "/NumerosAleatorios",
  }
);

function App() {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;
