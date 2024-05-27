const BingoService = () => {
    
  const generateRandomMatrix = () => {
    let matrix = [];
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 9; j++) {
        row.push(Math.random());
      }
      matrix.push(row);
    }
    return matrix;
  };

  const generateBlankSpacesMatrix = (randomMatrix) => {
    let blankSpacesMatrix = Array.from({ length: 3 }, () => Array(9).fill(1));

    for (let i = 0; i < 3; i++) {
      let row = randomMatrix[i].slice();
      row.sort((a, b) => b - a);
      for (let j = 0; j < 4; j++) {
        let index = randomMatrix[i].indexOf(row[j]);

        // Check if setting this blank space would result in more than 2 blank spaces in the column
        let otherRowsBlankSpaces = 0;
        for (let k = 0; k < 3; k++) {
          if (k !== i && blankSpacesMatrix[k][index] === undefined) {
            otherRowsBlankSpaces++;
          }
        }

        // If there are already 2 blank spaces in the column in other rows, search for a suitable blank space
        if (otherRowsBlankSpaces >= 2) {
          let foundSuitableSpace = false;
          let originalIndex = index;
          let originalRow = i;

          // Attempt to find a suitable space in the current row
          for (let attempts = 0; attempts < 9; attempts++) {
            if (blankSpacesMatrix[i][index] === 1) {
              // Check if this column has less than 2 blank spaces in the other rows
              let columnBlankSpaces = blankSpacesMatrix.reduce(
                (acc, row) => acc + (row[index] === undefined ? 1 : 0),
                0
              );
              if (columnBlankSpaces < 2) {
                blankSpacesMatrix[i][index] = undefined;
                foundSuitableSpace = true;
                break;
              }
            }
            index = (index + 1) % 9; // Move to the next column, wrapping around
            if (index === originalIndex) {
              break; // If we have looped through all columns, break the loop
            }
          }

          // If no suitable space was found, attempt to move the blank space up to a suitable spot
          if (!foundSuitableSpace) {
            for (
              let row = (i + 2) % 3;
              row !== originalRow;
              row = (row + 2) % 3
            ) {
              index = originalIndex;
              for (let attempts = 0; attempts < 9; attempts++) {
                if (blankSpacesMatrix[row][index] === 1) {
                  // Check if this column has less than 2 blank spaces in the other rows
                  let columnBlankSpaces = blankSpacesMatrix.reduce(
                    (acc, row) => acc + (row[index] === undefined ? 1 : 0),
                    0
                  );
                  if (columnBlankSpaces < 2) {
                    blankSpacesMatrix[row][index] = undefined;
                    foundSuitableSpace = true;
                    break;
                  }
                }
                index = (index + 1) % 9; // Move to the next column, wrapping around
                if (index === originalIndex) {
                  break; // If we have looped through all columns, break the loop
                }
              }
              if (foundSuitableSpace) {
                break;
              }
            }
            // If no suitable space was found in the rows above, leave the original space as undefined
            if (!foundSuitableSpace) {
              blankSpacesMatrix[originalRow][originalIndex] = undefined;
            }
          }
        } else {
          blankSpacesMatrix[i][index] = undefined;
        }
      }
    }

    return blankSpacesMatrix;
  };

  const generateNumbersMatrix = (randomMatrix) => {
    let numbersMatrix = Array.from({ length: 3 }, () => Array(9).fill(0));

    for (let col = 0; col < 9; col++) {
      let columnNumbers = [];

      for (let row = 0; row < 3; row++) {
        let randomValue = randomMatrix[row][col];
        let num;

        if (col === 0) {
          num = Math.floor(randomValue * 9) + 1;
        } else if (col === 8) {
          num = Math.floor(randomValue * 11) + 80;
        } else {
          num = Math.floor(randomValue * 10) + col * 10;

          num = Math.min(num, (col + 1) * 10 - 1);
        }

        columnNumbers.push(num);
      }

      // Check for duplicate numbers in the same column
      let uniqueColumnNumbers = new Set(columnNumbers);
      while (uniqueColumnNumbers.size < 3) {
        let randomValue = Math.random();
        let num;

        if (col === 0) {
          num = Math.floor(randomValue * 9) + 1;
        } else if (col === 8) {
          num = Math.floor(randomValue * 11) + 80;
        } else {
          num = Math.floor(randomValue * 10) + col * 10;
          num = Math.min(num, (col + 1) * 10 - 1);
        }

        uniqueColumnNumbers.add(num);
      }

      // Sort the numbers and assign them to the matrix
      columnNumbers = Array.from(uniqueColumnNumbers).sort((a, b) => a - b);
      for (let row = 0; row < 3; row++) {
        numbersMatrix[row][col] = columnNumbers[row];
      }
    }

    return numbersMatrix;
  };

  const combineMatrices = (blankSpacesMatrix, numbersMatrix) => {
    let combinedMatrix = [];
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 9; j++) {
        row.push(
          blankSpacesMatrix[i][j] === undefined
            ? undefined
            : numbersMatrix[i][j]
        );
      }
      combinedMatrix.push(row);
    }
    return combinedMatrix;
  };

  const generateCardHash = (card) => {
    let cardString = "";
    card.flat().forEach((num) => {
      if (num !== undefined) {
        cardString += num.toString();
      }
    });

    let hash = 0;
    for (let i = 0; i < cardString.length; i++) {
      hash = (hash << 5) - hash + cardString.charCodeAt(i);
      hash |= 0;
    }

    return hash;
  };

  const generateBingoCard = () => {
    let blankSpacesMatrix = generateBlankSpacesMatrix(generateRandomMatrix());
    const numbersMatrix = generateNumbersMatrix(generateRandomMatrix());
    let bingoCard = combineMatrices(blankSpacesMatrix, numbersMatrix);
    let cardHash = generateCardHash(bingoCard);
    return { bingoCard, cardHash };
  };

  const generateUniqueBingoCards = (quantity) => {
    let cardsSet = new Set();
    let uniqueCards = [];

    while (uniqueCards.length < quantity) {
      let { bingoCard, cardHash } = generateBingoCard();
      if (!cardsSet.has(cardHash)) {
        cardsSet.add(cardHash);
        uniqueCards.push(bingoCard);
      }
    }

    return uniqueCards;
  };

  return { generateUniqueBingoCards: generateUniqueBingoCards };
};

export default BingoService;
