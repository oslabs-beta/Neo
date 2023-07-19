'use client';
import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

type donutProps = {
  donutData: number[];
  idx: number;
  donutName: string;
  csize: number;
  overallScore: string;
  color: string;
};

export default function Donut({ donutData, idx, donutName, csize, overallScore, color }: donutProps) {
  const [myChartState, setMyChartState] = useState<Chart | null>(null);

  useEffect(() => {
    const chartRef = document.getElementById(`pie-chart${idx}`) as HTMLCanvasElement;

    if (chartRef) {
      if (myChartState) {
        myChartState.destroy();
      }

      const donutLabel = {
        id: 'doughnutLabel',
        // beforeDatasetsDraw(chart: Chart, args: any, pluginOptions: any) {
        beforeDatasetsDraw(chart: Chart) {
          const { ctx, data } = chart;
          ctx.save();
          const xCoor = chart.getDatasetMeta(0).data[0].x
          const yCoor = chart.getDatasetMeta(0).data[0].y
          // plug in score number here
          ctx.fillText(overallScore, xCoor, yCoor)
          ctx.textAlign = 'center'
          ctx.font = '20px sans-serif'
        }
      }

      const myChart = new Chart(chartRef, {
        type: 'doughnut',
        data: {
          // label: 'Overall',
          labels: ['Green'],
          datasets: [
            {
              data: [70, 30],
              backgroundColor: [color, 'white'],
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: donutName,
              font: { size: idx === 1 ? 24 : 16 },
            },
          },
        },
        plugins: [donutLabel],
      });

      const datasets = myChart.data.datasets;
      datasets[0].data = donutData;

      if (myChart) {
        myChart.update();
        setMyChartState(myChart as Chart);
      }
    }


  }, [donutData]);

  return (
    <div
      style={
        {
          height: `${csize}px`,
          width: `${csize}px`
        }}>
      <canvas
        id={`pie-chart${idx}`}
      ></canvas>
    </div>
  );
}
