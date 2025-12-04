import type { ProfitMarginData } from '../types/dashboard';

interface ProfitMarginChartProps {
  data: ProfitMarginData[];
}

export function ProfitMarginChart({ data }: ProfitMarginChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Margen de Ganancia General</h3>
        <p className="text-gray-600 text-sm">No hay datos disponibles.</p>
      </div>
    );
  }

  // ⭐ Evita errores de división cuando solo hay 1 dato
  const safeLength = Math.max(data.length - 1, 1);

  // Márgenes
  const margins = data.map((d) => d.margin);
  const maxMargin = Math.max(...margins);
  const minMargin = Math.min(...margins);

  // ⭐ Si max == min → evita rango 0
  const range = maxMargin === minMargin ? 1 : maxMargin - minMargin;

  // Extensión visual extra (+5 arriba y abajo)
  const visualMin = minMargin - 5;
  const visualMax = maxMargin + 5;
  const visualRange = visualMax - visualMin;

  // Genera path seguro
  const linePath = data
    .map((point, index) => {
      const x = (index / safeLength) * 100;

      const y =
        100 -
        ((point.margin - visualMin) / visualRange) * 100;

      return `${index === 0 ? 'M' : 'L'} ${x}% ${y}%`;
    })
    .join(' ');

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Margen de Ganancia General</h3>

      <div className="relative h-64">
        {/* Líneas guía */}
        <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <span className="w-10">{visualMax}%</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>
          <div className="flex items-center">
            <span className="w-10">{Math.round((visualMax + visualMin) / 2)}%</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>
          <div className="flex items-center">
            <span className="w-10">{visualMin}%</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>
        </div>

        {/* SVG */}
        <div className="absolute inset-0 pl-10 flex items-end">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="profitGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Línea principal */}
            <path
              d={linePath}
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            {/* Área debajo */}
            <path
              d={`${linePath} L 100% 100% L 0% 100% Z`}
              fill="url(#profitGradient)"
            />
          </svg>
        </div>
      </div>

      {/* Labels abajo */}
      <div className="flex justify-between mt-4 pl-10 text-xs text-gray-600">
        {data.map((point) => (
          <span key={point.month}>{point.month}</span>
        ))}
      </div>
    </div>
  );
}