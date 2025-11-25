import React, { useState, useEffect } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
//import { BsBarChartFill, BsGraphUp, BsPieChartFill } from "react-icons/bs";
//import { MdDelete, MdSave, MdClose, MdAdd, MdRemove } from "react-icons/md";
import {
  BarChart3 as BsBarChartFill,
  LineChart as BsGraphUp,
  PieChart as BsPieChartFill,
} from "lucide-react";
import {
  Trash2 as MdDelete,
  Save as MdSave,
  X as MdClose,
  Plus as MdAdd,
  Minus as MdRemove,
} from "lucide-react";

const ChartComponent = (props) => {
  const { node, updateAttributes, deleteNode } = props.nodeViewProps ?? props;

  if (!node || !node.attrs) {
    console.error("NodeView props missing:", props);
    return <div className="text-red-500">Chart Node Error</div>;
  }
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: node.attrs.title,
    chartType: node.attrs.chartType,
    data: node.attrs.data,
    isLive: node.attrs.isLive,
    updateInterval: node.attrs.updateInterval,
  });

  // Live update effect
  useEffect(() => {
    if (!node.attrs.isLive) return;

    const interval = setInterval(() => {
      const updatedData = node.attrs.data.map((item) => ({
        ...item,
        value: Math.max(0, item.value + (Math.random() - 0.5) * 20),
      }));

      updateAttributes({ data: updatedData });
    }, node.attrs.updateInterval);

    return () => clearInterval(interval);
  }, [
    node.attrs.isLive,
    node.attrs.updateInterval,
    node.attrs.data,
    updateAttributes,
  ]);

  const handleSave = () => {
    updateAttributes(editData);
    setIsEditing(false);
  };

  const handleDataChange = (index, field, value) => {
    const newData = [...editData.data];
    newData[index] = {
      ...newData[index],
      [field]: field === "value" ? parseFloat(value) || 0 : value,
    };
    setEditData({ ...editData, data: newData });
  };

  const addDataPoint = () => {
    setEditData({
      ...editData,
      data: [
        ...editData.data,
        { name: `Item ${editData.data.length + 1}`, value: 0 },
      ],
    });
  };

  const removeDataPoint = (index) => {
    if (editData.data.length <= 1) {
      alert("Chart must have at least one data point");
      return;
    }
    const newData = editData.data.filter((_, i) => i !== index);
    setEditData({ ...editData, data: newData });
  };

  const renderChart = () => {
    const data = node.attrs.data;
    const type = node.attrs.chartType;
    const COLORS = [
      "#3b82f6",
      "#ef4444",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#f43f5e",
    ];

    const commonProps = {
      width: "100%",
      height: 300,
    };

    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="text-center text-gray-500">Unknown chart type</div>
        );
    }
  };

  return (
    <NodeViewWrapper className="my-4">
      <div className="border-2 border-gray-300 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
        {isEditing ? (
          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Chart Title
              </label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter chart title"
              />
            </div>

            {/* Chart Type Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Chart Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  {
                    value: "bar",
                    label: "Bar",
                    icon: <BsBarChartFill size={20} />,
                  },
                  {
                    value: "line",
                    label: "Line",
                    icon: <BsGraphUp size={20} />,
                  },
                  {
                    value: "pie",
                    label: "Pie",
                    icon: <BsPieChartFill size={20} />,
                  },
                  {
                    value: "area",
                    label: "Area",
                    icon: <BsGraphUp size={20} />,
                  },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setEditData({ ...editData, chartType: type.value })
                    }
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                      editData.chartType === type.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {type.icon}
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Update Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Live Updates
                </label>
                <p className="text-xs text-gray-500">Auto-update chart data</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={editData.isLive}
                  onChange={(e) =>
                    setEditData({ ...editData, isLive: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Update Interval */}
            {editData.isLive && (
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Update Interval (ms)
                </label>
                <input
                  type="number"
                  value={editData.updateInterval}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      updateInterval: parseInt(e.target.value) || 3000,
                    })
                  }
                  min="1000"
                  step="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Data Points */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Data Points
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {editData.data.map((point, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Label"
                      value={point.name}
                      onChange={(e) =>
                        handleDataChange(index, "name", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Value"
                      value={point.value}
                      onChange={(e) =>
                        handleDataChange(index, "value", e.target.value)
                      }
                      className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeDataPoint(index)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      title="Remove"
                    >
                      <MdRemove size={20} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addDataPoint}
                className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <MdAdd size={20} /> Add Data Point
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
              >
                <MdSave size={20} /> Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditData({
                    title: node.attrs.title,
                    chartType: node.attrs.chartType,
                    data: node.attrs.data,
                    isLive: node.attrs.isLive,
                    updateInterval: node.attrs.updateInterval,
                  });
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                <MdClose size={20} />
              </button>
              <button
                type="button"
                onClick={deleteNode}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <MdDelete size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Chart Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {node.attrs.title}
                </h3>
                {node.attrs.isLive && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium mt-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Live Updates
                  </span>
                )}
              </div>
              {/* <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
              >
                <MdEdit size={16} /> Edit
              </button> */}
            </div>

            {/* Chart Render */}
            <div className="bg-gray-50 rounded-lg p-4">{renderChart()}</div>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export default ChartComponent;
