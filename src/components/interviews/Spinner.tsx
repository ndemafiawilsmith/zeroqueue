export default function Spinner({ text }: { text?: string }) {
  return (
    <div className="text-center text-gray-500 text-lg">
      <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      {text && <p className="mt-2">{text}</p>}
    </div>
  );
}