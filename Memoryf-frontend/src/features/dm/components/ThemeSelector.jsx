import './ThemeSelector.css';

export default function ThemeSelector({ theme, onThemeChange }) {
  const themes = [
    { id: 'light', color: 'bg-pink-200', label: '라이트' },
    { id: 'dark', color: 'bg-gray-800', label: '다크' },
    { id: 'blue', color: 'bg-blue-200', label: '블루' },
    { id: 'green', color: 'bg-green-200', label: '그린' }
  ];

  return (
    <div className={`p-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} theme-selector`}>
      <div className="flex items-center justify-center gap-4">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => onThemeChange(t.id)}
            className={`w-12 h-12 rounded-full ${t.color} transition-all ${
              theme === t.id 
                ? 'ring-4 ring-blue-500 scale-110' 
                : 'hover:scale-105 opacity-70 hover:opacity-100'
            }`}
            title={t.label}
          />
        ))}
      </div>
      <p className={`text-center text-sm mt-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        테마 변경
      </p>
    </div>
  );
}