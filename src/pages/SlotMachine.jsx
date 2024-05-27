import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Card,
  CardMedia,
  IconButton,
} from "@mui/material";
import { Remove, Add } from "@mui/icons-material";
import SlotMachineService from "../services/SlotMachineService";
import NavBar from "../components/NavBar";

const slotsBackgroundClass = "slot-background";

const SlotMachine = () => {
  const {
    generateSlotMachineLine,
    checkWinningLines,
    calculatePrize,
    items: initialItems,
  } = SlotMachineService();
  const [bet, setBet] = useState(10);
  const [balance, setBalance] = useState(0);
  const [rtp, setRtp] = useState(0);
  const [spinResult, setSpinResult] = useState([]);
  const [itemMultipliers, setItemMultipliers] = useState(
    initialItems.map((item) => item.multiplier)
  );
  const [enabledItems, setEnabledItems] = useState(initialItems);
  const [stats, setStats] = useState({
    totalBet: 0,
    totalWin: 0,
    spinCount: 0,
  });
  const [autoSpinCount, setAutoSpinCount] = useState(1);
  const [infiniteSpinning, setInfiniteSpinning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Add the class to the body when the component mounts
    document.body.classList.add(slotsBackgroundClass);
    // Remove the class from the body when the component unmounts
    return () => {
      document.body.classList.remove(slotsBackgroundClass);
    };
  }, []);

  useEffect(() => {
    if (infiniteSpinning) {
      intervalRef.current = setInterval(() => handleSpin(true), 100);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [infiniteSpinning]);

  const handleSpin = (isAutoSpin = false) => {
    const line = generateSlotMachineLine(enabledItems);
    setSpinResult(line);
    const winningItems = checkWinningLines(line);
    let prize = 0;

    if (winningItems.length > 0) {
      prize = calculatePrize(winningItems[0], bet);
    }

    setBalance((prevBalance) => prevBalance + prize - bet);
    setStats((prevStats) => {
      const updatedStats = {
        totalBet: prevStats.totalBet + bet,
        totalWin: prevStats.totalWin + prize,
        spinCount: prevStats.spinCount + 1,
      };
      setRtp((updatedStats.totalWin / updatedStats.totalBet) * 100);
      return updatedStats;
    });

    if (!isAutoSpin) {
      setRtp(
        (prevRtp) => ((stats.totalWin + prize) / (stats.totalBet + bet)) * 100
      );
    }
  };

  const handleMultiplierChange = (itemChanged, index, newMultiplier) => {
    const newMultipliers = [...itemMultipliers];
    newMultipliers[index] = newMultiplier;
    setItemMultipliers(newMultipliers);
    const itemIndex= enabledItems.findIndex((item) => item.name === itemChanged);
    enabledItems[itemIndex].multiplier = newMultiplier;
    setEnabledItems([...enabledItems])
  };

  const handleAutoSpin = () => {
    for (let i = 0; i < autoSpinCount; i++) {
      setTimeout(() => handleSpin(true), i * 100);
    }
  };

  const handleInfiniteSpin = () => {
    setInfiniteSpinning(!infiniteSpinning);
  };

  const toggleItem = (index) => {
    const item = initialItems[index];
    const isEnabled = enabledItems.some((i) => i.name === item.name);

    if (isEnabled) {
      setEnabledItems((prevItems) =>
        prevItems.filter((i) => i.name !== item.name)
      );
    } else {
      setEnabledItems((prevItems) => [...prevItems, item]);
    }
  };

  const getImagePath = (itemName) => {
    return require(`../assets/${itemName}.png`);
  };

  const resetStats = () => {
    setBalance(0);
    setRtp(0);
    setStats({
      totalBet: 0,
      totalWin: 0,
      spinCount: 0,
    });
  };

  return (
    <>
      <NavBar />
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Box sx={{ width: "12%", p: 2, borderRight: "1px solid #ccc", minWidth: "200px"}}>
          <Typography variant="h6">Multiplicadores</Typography>
          {initialItems.map((item, index) => (
            <Box key={item.name} display="flex" alignItems="center" my={1}>
              <CardMedia
                component="img"
                image={getImagePath(item.name)}
                alt={item.name}
                sx={{ width: 20, height: 20, mr: 2 }}
              />
              <TextField
                value={itemMultipliers[index]}
                onChange={(e) =>
                  handleMultiplierChange(item.name,index, Number(e.target.value))
                }
                InputProps={{
                  sx: { height: 20 },
                }}
                disabled={!enabledItems.some((i) => i.name === item.name)}
                fullWidth
                sx={{ height: 20 }}
              />
              <IconButton onClick={() => toggleItem(index)}>
                {enabledItems.some((i) => i.name === item.name) ? (
                  <Remove />
                ) : (
                  <Add />
                )}
              </IconButton>
            </Box>
          ))}
        </Box>
        <Box sx={{ width: "80%", p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Maquina Tragamonedas
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" mb={2}>
                {(spinResult.length > 0 ? spinResult : Array(3).fill(null)).map(
                  (item, index) => (
                    <Card
                      key={index}
                      sx={{
                        width: 120,
                        height: 120,
                        py: 1,
                        px: 1,
                        mx: 1,
                        border: "1px solid white",
                      }}
                    >
                      {item ? (
                        <CardMedia
                          component="img"
                          height="100"
                          width="100"
                          image={getImagePath(item.name)}
                          alt={item.name}
                        />
                      ) : (
                        <Box sx={{ height: 100, width: 100 }} />
                      )}
                    </Card>
                  )
                )}
              </Box>
            </Grid>
            <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Apuesta"
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Cantidad de tiradas"
                value={autoSpinCount}
                onChange={(e) => setAutoSpinCount(Number(e.target.value))}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleAutoSpin}
                fullWidth
              >
                Girar
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color={infiniteSpinning ? "error" : "primary"}
                onClick={handleInfiniteSpin}
                fullWidth
              >
                {infiniteSpinning ? "Pausar" : "Modo Libre"}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="warning"
                onClick={resetStats}
                fullWidth
              >
                Reiniciar estadisticas
              </Button>
            </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">
                Balance: ${balance.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">
                Return to Player (RTP): {rtp.toFixed(2)}%
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">
                Cantidad de tiradas: {stats.spinCount}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default SlotMachine;
