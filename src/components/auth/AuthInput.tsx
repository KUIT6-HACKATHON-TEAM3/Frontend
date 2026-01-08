interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function AuthInput({ label, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label className="text-sm font-bold text-gray-700">{label}</label>
      <input 
        className="p-3 border rounded-lg focus:outline-none focus:border-green-500" // 테마색 적용
        {...props} 
      />
    </div>
  );
}