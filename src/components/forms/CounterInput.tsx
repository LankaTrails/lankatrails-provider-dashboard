import { Minus, Plus } from "lucide-react";

interface CounterInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const CounterInput: React.FC<CounterInputProps> = ({ value, onChange, min = 0, max = Infinity }) => {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

 return (
  <div className="flex items-center w-full max-w-xs border rounded-md px-3 py-2 bg-white shadow-sm">
    <button
      onClick={handleDecrease}
      disabled={value <= min}
      className="p-1 text-gray-600 hover:text-black disabled:opacity-40"
    >
      <Minus size={16} />
    </button>
    <span className="flex-1 text-center text-lg">{value}</span>
    <button
      onClick={handleIncrease}
      disabled={value >= max}
      className="p-1 text-gray-600 hover:text-black disabled:opacity-40"
    >
      <Plus size={16} />
    </button>
  </div>
);

};

export default CounterInput;
