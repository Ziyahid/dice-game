export default function Dice({ roll }) {
    return (
      <div className="mt-6 text-5xl font-bold text-yellow-400">
        {roll ? `🎲 ${roll}` : "Roll the Dice!"}
      </div>
    );
  }