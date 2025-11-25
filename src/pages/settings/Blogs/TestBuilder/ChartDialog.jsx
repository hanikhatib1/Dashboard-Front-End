import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog"; 
/* import { BsBarChartFill, BsGraphUp, BsPieChartFill } from 'react-icons/bs';
import { MdAdd, MdRemove, MdClose } from 'react-icons/md'; */
import {
  BarChart3 as BsBarChartFill,
  LineChart as BsGraphUp,
  PieChart as BsPieChartFill,
  Plus as MdAdd,
  Minus as MdRemove,
  X as MdClose,
} from "lucide-react";

const ChartDialog = ({ open, onOpenChange, onInsert }) => {
  const [chartConfig, setChartConfig] = useState({
    title: "New Chart",
    chartType: "bar",
    data: [
      { name: "Category A", value: 30 },
      { name: "Category B", value: 45 },
      { name: "Category C", value: 60 },
    ],
    isLive: false,
    updateInterval: 3000,
  });

  const handleDataChange = (index, field, value) => {
    const newData = [...chartConfig.data];
    newData[index] = {
      ...newData[index],
      [field]: field === "value" ? parseFloat(value) || 0 : value,
    };
    setChartConfig({ ...chartConfig, data: newData });
  };

  const addDataPoint = () => {
    setChartConfig({
      ...chartConfig,
      data: [
        ...chartConfig.data,
        {
          name: `Category ${String.fromCharCode(65 + chartConfig.data.length)}`,
          value: 0,
        },
      ],
    });
  };

  const removeDataPoint = (index) => {
    if (chartConfig.data.length <= 1) {
      alert("Chart must have at least one data point");
      return;
    }
    const newData = chartConfig.data.filter((_, i) => i !== index);
    setChartConfig({ ...chartConfig, data: newData });
  };

  const handleInsert = () => {
    onInsert(chartConfig);
    onOpenChange(false);
    // Reset form
    setChartConfig({
      title: "New Chart",
      chartType: "bar",
      data: [
        { name: "Category A", value: 30 },
        { name: "Category B", value: 45 },
        { name: "Category C", value: 60 },
      ],
      isLive: false,
      updateInterval: 3000,
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50 p-6">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-2xl font-bold text-gray-800">
              Insert Chart
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Close"
              >
                <MdClose size={24} />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-6">
            {/* Chart Title */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Chart Title
              </label>
              <input
                type="text"
                value={chartConfig.title}
                onChange={(e) =>
                  setChartConfig({ ...chartConfig, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter chart title"
              />
            </div>

            {/* Chart Type */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Chart Type
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  {
                    value: "bar",
                    label: "Bar Chart",
                    icon: <BsBarChartFill size={24} />,
                  },
                  {
                    value: "line",
                    label: "Line Chart",
                    icon: <BsGraphUp size={24} />,
                  },
                  {
                    value: "pie",
                    label: "Pie Chart",
                    icon: <BsPieChartFill size={24} />,
                  },
                  {
                    value: "area",
                    label: "Area Chart",
                    icon: <BsGraphUp size={24} />,
                  },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setChartConfig({ ...chartConfig, chartType: type.value })
                    }
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      chartConfig.chartType === type.value
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    {type.icon}
                    <span className="text-xs font-medium text-center">
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Updates Toggle */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Enable Live Updates
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  Chart data will update automatically at specified intervals
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={chartConfig.isLive}
                  onChange={(e) =>
                    setChartConfig({ ...chartConfig, isLive: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Update Interval (only if live updates enabled) */}
            {chartConfig.isLive && (
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Update Interval (milliseconds)
                </label>
                <input
                  type="number"
                  value={chartConfig.updateInterval}
                  onChange={(e) =>
                    setChartConfig({
                      ...chartConfig,
                      updateInterval: parseInt(e.target.value) || 3000,
                    })
                  }
                  min="1000"
                  step="1000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="3000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum: 1000ms (1 second). Recommended: 3000ms (3 seconds)
                </p>
              </div>
            )}

            {/* Data Points */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">
                Chart Data
              </label>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                {chartConfig.data.map((point, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Label"
                        value={point.name}
                        onChange={(e) =>
                          handleDataChange(index, "name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="w-32">
                      <input
                        type="number"
                        placeholder="Value"
                        value={point.value}
                        onChange={(e) =>
                          handleDataChange(index, "value", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDataPoint(index)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={chartConfig.data.length <= 1}
                      title="Remove data point"
                    >
                      <MdRemove size={20} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addDataPoint}
                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium shadow-sm"
              >
                <MdAdd size={20} /> Add Data Point
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <Dialog.Close asChild>
              <button
                type="button"
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={handleInsert}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium shadow-lg"
            >
              Insert Chart
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ChartDialog;
