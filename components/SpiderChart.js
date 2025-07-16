import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { getRingColor } from '../lib/dataLoader';
import styles from './SpiderChart.module.css';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function SpiderChart({ dimensions, technologies, selectedRing = null, selectedTechnology = null }) {
  const chartRef = useRef();

  // Filter technologies based on selected ring
  const filteredTechnologies = selectedRing 
    ? technologies.filter(tech => tech.ring === selectedRing)
    : technologies;

  // Further filter if specific technology is selected
  const displayTechnologies = selectedTechnology
    ? [selectedTechnology]
    : filteredTechnologies;

  const data = {
    labels: dimensions.map(d => d.name),
    datasets: displayTechnologies.map((tech, index) => ({
      label: tech.name,
      data: dimensions.map(dim => tech.dimensions[dim.id] || 0),
      backgroundColor: getRingColor(tech.ring, 0.1),
      borderColor: getRingColor(tech.ring, 0.8),
      borderWidth: 2,
      pointBackgroundColor: getRingColor(tech.ring, 1),
      pointBorderColor: getRingColor(tech.ring, 1),
      pointRadius: 4,
      pointHoverRadius: 6,
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const tech = displayTechnologies[context.datasetIndex];
            const dimension = dimensions[context.dataIndex];
            return `${context.dataset.label}: ${context.parsed.r}/10 in ${dimension.name}`;
          }
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        min: 0,
        ticks: {
          stepSize: 2,
          showLabelBackdrop: false,
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          font: {
            size: 14,
            weight: 'bold'
          },
          color: '#333'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'point'
    }
  };

  return (
    <div className={styles.spiderChartContainer} style={{ height: '600px', width: '100%' }}>
      <Radar ref={chartRef} data={data} options={options} />
    </div>
  );
}