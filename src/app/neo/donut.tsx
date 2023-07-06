'use client';
import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

type donutProps = {
  donutData: number[];
  idx: number;
};

export default function Donut({ donutData, idx }: donutProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const myChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (myChartRef.current) {
        myChartRef.current.destroy();
      }

      const myChart = new Chart(chartRef.current, {
        type: 'doughnut',
        data: {
          label: 'Overall',
          labels: ['Green'],
          datasets: [
            {
              data: [70, 30],
              backgroundColor: ['green', 'white'],
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Overall Score',
              font: {size: 24},
            },
          }
        },
      });

      const datasets = myChart.data.datasets;
      datasets[0].data = donutData;
      myChart.update();

      myChartRef.current = myChart;
    }

    // const pieChartCanvas: HTMLElement | null = document.getElementById(
    //   `pie-chart${idx}`
    // );
    // if (pieChartCanvas) {
    // new Chart(pieChartCanvas, {
    //   type: 'doughnut',

    //   data: {
    //     label: 'Overall',
    //     labels: ['Green'],
    //     datasets: [
    //       {
    //         data: [70, 30],
    //         backgroundColor: ['green', 'white'],
    //       },
    //     ],
    //   },
    //   options: {
    //     title: {
    //       display: true,
    //       text: 'Overall Score',
    //       fontSize: 24,
    //     },
    //   },
    // });
    // }

    // const datasets = myChart.data.datasets;
    // datasets[0].data = [30, 70];
    // myChart.update();

    // myChart.destroy();
  }, [donutData]);

  // const pieCharts = [];

  // for (let i = 0; i < 5; i++) {
  //   pieCharts.push(
  //     <canvas key={i} id={`pie-chart${i}`} width="200" height="200"></canvas>
  //   );
  // }

  return (
    <>
      <canvas
        ref={chartRef}
        id={`pie-chart${idx}`}
        width="200"
        height="200"
      ></canvas>
    </>
  );
}
