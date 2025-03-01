import { useState, useEffect } from "react";
import axios from "axios";
import Dice from "./components/Dice";
import Balance from "./components/Balance";

export default function App() {
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [rollResult, setRollResult] = useState(null);
  const [serverSeed, setServerSeed] = useState("");
  const [hash, setHash] = useState("");

  useEffect(() => {
    axios.get("https://dice-game-6drw.onrender.com/balance").then((res) => setBalance(res.data.userBalance));
  }, []);

  const rollDice = async () => {
    if (bet <= 0 || bet > balance) return alert("Invalid bet amount!");

    const clientSeed = Math.random().toString(36).substring(2, 10);
    const response = await axios.post("https://dice-game-6drw.onrender.com//roll-dice", { betAmount: bet, clientSeed });

    setRollResult(response.data.roll);
    setBalance(response.data.userBalance);
    setServerSeed(response.data.serverSeed);
    setHash(response.data.hash);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Provably Fair Dice Game 🎲</h1>
      
      <Balance balance={balance} />
      
      <div className="flex items-center gap-4 mt-4">
        <input
          type="number"
          value={bet}
          onChange={(e) => setBet(Number(e.target.value))}
          className="p-2 bg-gray-800 text-white border border-gray-500 rounded w-24 text-center"
          min="1"
        />
        <button 
          className="p-3 bg-green-500 hover:bg-green-600 rounded text-white font-bold transition"
          onClick={rollDice}
        >
          Roll Dice
        </button>
      </div>
      
      <Dice roll={rollResult} />
      
      {rollResult && (
        <div className="mt-4 text-lg bg-gray-800 p-4 rounded border border-gray-600 text-center">
          <p className="text-yellow-400">Result: {rollResult} 🎲</p>
          <p className="text-blue-400">Server Seed: {serverSeed}</p>
          <p className="text-red-400">SHA-256 Hash: {hash.substring(0, 20)}...</p>
        </div>
      )}
    </div>
  );
}

