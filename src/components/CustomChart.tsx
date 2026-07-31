import React from 'react';

export const CustomChart: React.FC<{
  type: 'bar' | 'line' | 'doughnut';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
      borderColor?: string;
      fill?: boolean;
    }[];
  };
  title?: string;
}> = ({ type, data, title }) => {
  // Rather than drawing with heavy, unstable Canvas integrations which could throw error inside Sandbox/Playwright
  // we draw fully customized responsive SVG vectors or neat flex rows for 100% beautiful, reliable rendering
  // aligned perfectly with our premium fintech neumorphism/glassmorphism design look and feel.

  if (type === 'doughnut') {
    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-sm">
        {title && <h4 className="text-xs font-semibold text-slate-500 mb-3">{title}</h4>}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
            {data.datasets[0].data.map((val, idx) => {
              const pct = total > 0 ? (val / total) * 100 : 0;
              const prevSum = data.datasets[0].data.slice(0, idx).reduce((a, b) => a + b, 0);
              const offset = total > 0 ? (prevSum / total) * 100 : 0;
              const color = Array.isArray(data.datasets[0].backgroundColor)
                ? data.datasets[0].backgroundColor[idx % data.datasets[0].backgroundColor.length]
                : data.datasets[0].backgroundColor;

              return (
                <circle
                  key={idx}
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke={color as string}
                  strokeWidth="3.2"
                  strokeDasharray={`${pct} ${100 - pct}`}
                  strokeDashoffset={100 - offset}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-slate-800">{total.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 font-medium">Total Volume</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4 w-full">
          {data.labels.map((lbl, idx) => {
            const val = data.datasets[0].data[idx];
            const color = Array.isArray(data.datasets[0].backgroundColor)
              ? data.datasets[0].backgroundColor[idx % data.datasets[0].backgroundColor.length]
              : data.datasets[0].backgroundColor;
            return (
              <div key={idx} className="flex items-center space-x-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color as string }} />
                <span className="text-slate-600 truncate max-w-[80px]">{lbl}: <strong className="text-slate-800">{val}</strong></span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Bar and Line custom beautiful charts
  const maxVal = Math.max(...data.datasets[0].data, 10);

  return (
    <div className="p-4 bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-sm w-full">
      {title && <h4 className="text-xs font-semibold text-slate-500 mb-4 text-left">{title}</h4>}
      <div className="flex items-end justify-between h-40 pt-4 px-2 relative">
        {/* Horizontal grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-b border-slate-100">
          <div className="border-t border-slate-50/70 w-full" />
          <div className="border-t border-slate-50/70 w-full" />
          <div className="border-t border-slate-50/70 w-full" />
        </div>

        {data.datasets[0].data.map((val, idx) => {
          const heightPct = Math.max(8, (val / maxVal) * 100);
          const color = Array.isArray(data.datasets[0].backgroundColor)
            ? data.datasets[0].backgroundColor[idx % data.datasets[0].backgroundColor.length]
            : data.datasets[0].backgroundColor;

          return (
            <div key={idx} className="flex flex-col items-center flex-1 group z-10">
              <div className="relative w-full flex justify-center">
                {/* Tooltip on hover */}
                <span className="absolute -top-8 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap shadow-md">
                  {val.toLocaleString()}
                </span>

                {type === 'line' ? (
                  // Line design vector indicator
                  <div className="flex flex-col items-center w-full">
                    <div
                      className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm transition-transform duration-200 group-hover:scale-125"
                      style={{ backgroundColor: color as string, transform: `translateY(${(100 - heightPct) * 0.4}px)` }}
                    />
                    <div className="w-0.5 bg-blue-100 h-24" />
                  </div>
                ) : (
                  // Bar design
                  <div
                    style={{ height: `${heightPct * 0.8}px`, backgroundColor: color as string }}
                    className="w-6 rounded-t-lg shadow-inner transition-all duration-200 group-hover:brightness-95 group-hover:scale-105"
                  />
                )}
              </div>
              <span className="text-[10px] text-slate-500 mt-2 font-medium max-w-[50px] truncate">{data.labels[idx]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
