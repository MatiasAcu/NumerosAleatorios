import React, { useEffect, useState } from "react";
import BingoService from "../services/BingoService";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  Button,
  Grid,
  Typography,
  TextField,
  Box,
  Stack,
} from "@mui/material";
import NavBar from "../components/NavBar";

const bingoBackgroundClass = "bingo-background";

const Bingo = () => {
  const bingoService = BingoService();
  const [amount, setAmount] = useState(0);
  const [color, setColor] = useState(require('randomcolor').randomColor());
  const [cards, setCards] = useState([]);

  useEffect(() => {
    document.body.classList.add(bingoBackgroundClass);
    return () => {
      document.body.classList.remove(bingoBackgroundClass);
    };
  }, []);

  const handleGenerateCards = () => {
    const generatedCards = bingoService.generateUniqueBingoCards(amount);
    setCards(generatedCards);
  };

  const exportToPDF = async () => {
    const doc = new jsPDF();
    const cardElements = document.querySelectorAll(".bingo-card");

    for (let i = 0; i < cardElements.length; i++) {
      if (i > 0 && i % 6 === 0) {
        doc.addPage();
      }
      const cardElement = cardElements[i];

      cardElement.style.border = "none";
      cardElement.style.boxShadow = "none";

      const canvas = await html2canvas(cardElements[i], {
        backgroundColor: null,
      });

      cardElement.style.border = "";
      cardElement.style.boxShadow = "";

      const imgData = canvas.toDataURL("image/png");
      const position = i % 6;
      const x = (position % 2) * 100 + 10;
      const y = Math.floor(position / 2) * 80;
      doc.addImage(imgData, "PNG", x, y, 90, 60);
    }

    doc.save("bingo-cards.pdf");
  };

  return (
    <>
    <NavBar></NavBar>
    <Box p={2}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Generador de Cartones
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerateCards();
            }}
          >
            <Grid container spacing={2} columns={2}>
              <Grid item xs={1}>
                <TextField
                  label="Cantidad"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                  fullWidth
                  required
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              <Grid item xs={1}>
                <TextField
                  label="Color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2} spacing={2}>
                <Stack justifyContent={"space-between"} spacing={2}>
                  <Button variant="contained" color="primary" type="submit">
                    Generar
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={exportToPDF}
                  >
                    Exportar a PDF
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3} columns={3}>
            {cards.map((card, index) => (
              <Grid className="bingo-card" key={index} item xs={1}>
                <table
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    minHeight: "170px",
                    minWidth: "170px",
                  }}
                >
                  <tbody>
                    {card.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            style={{
                              color: "black",
                              border: "1px solid black",
                              width: "30px",
                              height: "30px",
                              backgroundColor:
                                cell === undefined ? color : "white",
                              textAlign: "center",
                            }}
                          >
                            {cell !== undefined ? cell : ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
    </>
  );
};

export default Bingo;
