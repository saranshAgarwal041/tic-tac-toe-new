import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [winningLine, setWinningLine] = useState([]);
  const [overallWinner, setOverallWinner] = useState(null);

  const winnerInfo = calculateWinner(board);
  const winner = winnerInfo ? winnerInfo.winner : null;

  // ✅ agar winnerInfo change hota hai to winningLine update hoga
  useEffect(() => {
    if (winnerInfo) {
      setWinningLine(winnerInfo.line);
    } else {
      setWinningLine([]);
    }
  }, [winnerInfo]);

  function handleClick(index) {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  }

  function handleReset() {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinningLine([]);
  }

  function handleNextRound() {
    if (winner) {
      setScore((prev) => {
        const updated = { ...prev, [winner]: prev[winner] + 1 };
        if (updated[winner] === 3) {
          setOverallWinner(winner);
        }
        return updated;
      });
    }
    handleReset();
  }

  function renderSquare(index) {
    const highlight = winningLine.includes(index) ? "highlight" : "";
    return (
      <button className={`square ${highlight}`} onClick={() => handleClick(index)}>
        {board[index]}
      </button>
    );
  }

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (!board.includes(null)) {
    status = "It's a Draw!";
  } else {
    status = `Next player: ${isXNext ? "X" : "O"}`;
  }

  return (
    <div className="container">
      <h1>Tic Tac Toe</h1>

      {/* Scoreboard */}
      <div className="scoreboard">
        <p className="score x-score">X Wins: {score.X}</p>
        <p className="score o-score">O Wins: {score.O}</p>
      </div>

      {/* Board */}
      <div className="board">
        {board.map((_, i) => renderSquare(i))}
      </div>

      {/* Status */}
      <p className="status">{status}</p>

      {/* Buttons */}
      <div className="controls">
        <button onClick={handleReset} className="btn gray">Reset Board</button>
        <button
          onClick={handleNextRound}
          disabled={!winner}
          className={`btn ${winner ? "green" : "disabled"}`}
        >
          Next Round
        </button>
      </div>

      {/* Overall Winner Popup */}
      {overallWinner && (
        <div className="popup">
          <div className="popup-content">
            <h2>🏆 Overall Winner: {overallWinner} 🏆</h2>
            <button
              onClick={() => {
                setScore({ X: 0, O: 0 });
                setOverallWinner(null);
                handleReset();
              }}
              className="btn blue"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
