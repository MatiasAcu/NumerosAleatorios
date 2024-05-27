const SlotMachineService = () => {
    const getRandomItem = (items) => {
      const randIndex = Math.floor(Math.random() * items.length);
      return items[randIndex];
    };
  
    const items = [
      { name: "watermelon", multiplier: 2 },
      { name: "lemon", multiplier: 5 },
      { name: "grape", multiplier: 10 },
      { name: "cherries", multiplier: 15 },
      { name: "horseshoe", multiplier: 30 },
      { name: "dollar", multiplier: 50 },
      { name: "bar", multiplier: 60 },
      { name: "bell", multiplier: 150 },
      { name: "diamond", multiplier: 300 },
      { name: "crown", multiplier: 450 },
      { name: "seven", multiplier: 700 },
    ];
  
    const lines = [[0, 1, 2]];
  
    const generateSlotMachineLine = (enabledItems) => {
      const line = [];
      for (let i = 0; i < 3; i++) {
        line.push(getRandomItem(enabledItems));
      }
      return line;
    };
  
    const checkWinningLines = (line) => {
      const winningItems = [];
      lines.forEach((lineIndices) => {
        const [a, b, c] = lineIndices;
        if (line[a].name === line[b].name && line[b].name === line[c].name) {
          winningItems.push(line[a].name);
        }
      });
      return winningItems;
    };
  
    const calculatePrize = (winningItem, bet) => {
      const item = items.find((i) => i.name === winningItem);
      return bet * item.multiplier;
    };
  
    return {
      generateSlotMachineLine,
      checkWinningLines,
      calculatePrize,
      items,
    };
  };
  
  export default SlotMachineService;