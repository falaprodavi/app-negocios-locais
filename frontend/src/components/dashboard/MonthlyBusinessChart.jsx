import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { eachDayOfInterval, endOfMonth, format, parseISO, startOfMonth } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MonthlyBusinessChart = ({ data }) => {
  const timeZone = "America/Sao_Paulo";

  // Gera uma lista de dias do mês atual
  const now = new Date();
  const allDays = eachDayOfInterval({
    start: startOfMonth(now),
    end: endOfMonth(now),
  });

  const dailyCounts = allDays.map((day) => {
    const dayStr = format(day, "yyyy-MM-dd");

    const count = data.filter((b) => {
      const utcDate = parseISO(b.createdAt);
      const zonedDate = utcToZonedTime(utcDate, timeZone);
      const zonedDateStr = format(zonedDate, "yyyy-MM-dd");
      return zonedDateStr === dayStr;
    }).length;

    return {
      date: dayStr,
      count,
    };
  });

  const chartData = {
    labels: dailyCounts.map((d) => format(parseISO(d.date), "dd/MM")),
    datasets: [
      {
        label: "Cadastros por dia",
        data: dailyCounts.map((d) => d.count),
        backgroundColor: "#4f46e5",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MonthlyBusinessChart;
