
import { PieChart as RePieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./PieChart.css";

const PieChart = ({ tasks }) => {
  const priorityData = ["High", "Medium", "Low"].map((level) => ({
    name: level,
    value: tasks.filter((task) => task.priority === level).length,
  }));

  const COLORS = ["#ff4d4f", "#faad14", "#1890ff"];

  return (
    <RePieChart width={300} height={300}>
      <Pie
        data={priorityData}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {priorityData.map((entry, index) => (
          <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </RePieChart>
  );
};

export default PieChart;
