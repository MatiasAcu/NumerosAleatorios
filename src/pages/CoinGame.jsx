import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, TextField, Button } from "@mui/material";
import { useSpring, animated } from "react-spring";
import NavBar from "../components/NavBar";

const coinBackgroundClass = "coin-background";

const CoinGame = () => {
  const [money, setMoney] = useState(0);
  const [heads, setHeads] = useState(0);
  const [tails, setTails] = useState(0);
  const [wins, setWins] = useState(0);
  const [flips, setFlips] = useState(0);
  const [flipResult, setFlipResult] = useState(null);
  const [betPrice, setBetPrice] = useState(1);
  const [winPrize, setWinPrize] = useState(10);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    document.body.classList.add(coinBackgroundClass);
    return () => {
      document.body.classList.remove(coinBackgroundClass);
    };
  }, []);

  const flipCoin = () => {
    return Math.random() < 0.5 ? "heads" : "tails";
  };

  const handleFlip = () => {

    setFlipping(true);

    setTimeout(() => {
      const result = flipCoin();
      setFlipResult(result);
      updateGame(result);
      setFlipping(false);
    }, 1000);
  };

  const updateGame = (result) => {
    setMoney((prevMoney) => prevMoney - betPrice);

    if (result === "heads") {
      setHeads((prevHeads) => prevHeads + 1);
    } else {
      setTails((prevTails) => prevTails + 1);
    }

    const newHeads = result === "heads" ? heads + 1 : heads;
    const newTails = result === "tails" ? tails + 1 : tails;

    if (newTails - newHeads >= 3) {
      setMoney((prevMoney) => prevMoney + winPrize);
      setWins((prevWins) => prevWins + 1);
      resetCount();
    }

    setFlips(flips + 1)
  };

  const resetCount = () => {
    setHeads(0);
    setTails(0);
  };

  const restartGame = () => {
    setMoney(0);
    setHeads(0);
    setTails(0);
    setWins(0);
    setFlips(0);
    setFlipResult(null);
  };

  const { transform, opacity } = useSpring({
    opacity: flipping ? 0 : 1,
    transform: `perspective(600px) rotateX(${flipping ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80, duration: 500 },
  });

  return (
    <>
      <NavBar />
      <Container>
        <Typography variant="h4" gutterBottom pt={2}>
          Juego de la Moneda
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="h6">Configuracion</Typography>
            <TextField
              label="Precio por tirada"
              fullWidth
              value={betPrice}
              onChange={(e) => setBetPrice(Number(e.target.value))}
              margin="normal"
            />
            <TextField
              label="Premio"
              fullWidth
              value={winPrize}
              onChange={(e) => setWinPrize(Number(e.target.value))}
              margin="normal"
            />
            <Typography variant="h6">Balance: ${money}</Typography>
            <Typography variant="h6">
              Cara: {heads} | Cruz: {tails}
            </Typography>
            <Typography variant="h6">Tiradas: {flips}</Typography>
            <Typography variant="h6">Victorias: {wins}</Typography>
            <Button variant="contained" color="secondary" onClick={restartGame}>
              Reiniciar
            </Button>
          </Grid>
          <Grid item xs={6} style={{ textAlign: "center" }}>
            <animated.div
              onClick={handleFlip}
              style={{
                opacity,
                transform,
                width: "200px",
                height: "200px",
                margin: "20px auto",
                backgroundColor: flipResult ? (flipResult === "heads" ? "#8B0000" : "#2f4ffc") : "gray",
                borderRadius: "50%",
                border: "5px solid #FFF",
                lineHeight: "100px",
                fontSize: "24px",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {flipResult ? (flipResult === "heads" ? "Cara" : "Cruz") : "Empezar"}
            </animated.div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default CoinGame;
