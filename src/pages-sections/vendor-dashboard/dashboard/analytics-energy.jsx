"use client";

import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import styled from "@mui/material/styles/styled";
import useTheme from "@mui/material/styles/useTheme";
import Select from "@mui/material/Select";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import ApexChart from "./apex-chart";
import { H5 } from "components/Typography";
import { FlexBetween } from "components/flex-box";
import { getCookie, USER_LOCAL_ID } from "utils/cookies-utils";
import { analyticsChartOptions } from "./chart-options";
import { getMonthlyCategories } from "utils/misc-utils";

const categoriesHourly = Array.from({ length: 24 }, (_, i) => `${i}:00`);
const categoriesDaily = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
const categoriesMonthly = getMonthlyCategories();//["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const StyledSelect = styled(Select)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 500,
  color: theme.palette.grey[600],
  "& fieldset": {
    border: "0 !important"
  },
  "& .MuiSelect-select": {
    padding: 0,
    paddingRight: "8px !important"
  }
}));

const AnalyticsEnergy = () => {
  const theme = useTheme();
  const [selectType, setSelectType] = useState("hourly");
  const [data, setData] = useState([]);
  const [series, setSeries] = useState([{ name: "Energy", data: [] }]);
  const [categories, setCategories] = useState(categoriesHourly);

  useEffect(() => {
    const ownerId = getCookie(USER_LOCAL_ID);

    const getAnalytics = async () => {
      const formData = new FormData();
      formData.append("ownerid", ownerId);
      try {
        const response = await fetch('/dashboard/api/analytics', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.data);
          setData(data.data);
          updateChart(selectType, data.data);
        } else {
          console.error("Failed to get stats");
        }
      } catch (error) {
        console.error("Error get stats: ", error);
      }
    };

    getAnalytics();
  }, []);

  const updateChart = (type, data) => {
    let transformedData;
    if (type === "hourly") {
      transformedData = transformHourlyData(data);
      setCategories(categoriesHourly);
    } else if (type === "daily") {
      transformedData = transformDailyData(data);
      setCategories(categoriesDaily);
    } else if (type === "monthly") {
      transformedData = transformMonthlyData(data);
      setCategories(categoriesMonthly);
    }
    setSeries([{ name: "Energy", data: transformedData }]);
  };

  const transformHourlyData = (data) => {
    return categoriesHourly.map(hour => {
      const record = data.find(d => new Date(d.hour).getHours() === parseInt(hour));
      return record ? record.avg_energy : 0;
    });
  };

  const transformDailyData = (data) => {
    const dailyEnergyMap = new Map();
    data.forEach(d => {
      const date = new Date(d.hour);
      const day = date.toISOString().split('T')[0]; // Get the day in 'YYYY-MM-DD' format
      if (dailyEnergyMap.has(day)) {
        dailyEnergyMap.set(day, dailyEnergyMap.get(day) + d.avg_energy);
      } else {
        dailyEnergyMap.set(day, d.avg_energy);
      }
    });

    const today = new Date();
    const dailyData = Array.from({ length: 30 }, (_, i) => {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() - i);
      const dayKey = currentDate.toISOString().split('T')[0];
      return dailyEnergyMap.get(dayKey) || 0;
    }).reverse(); // Reverse to start from the oldest day

    return dailyData;
  };

  const transformMonthlyData = (data) => {
    const monthlyEnergyMap = new Map();
    data.forEach(d => {
      const date = new Date(d.hour);
      const yearMonth = `${date.getFullYear()}-${date.getMonth()}`; // Get the year and month
      if (monthlyEnergyMap.has(yearMonth)) {
        monthlyEnergyMap.set(yearMonth, monthlyEnergyMap.get(yearMonth) + d.avg_energy);
      } else {
        monthlyEnergyMap.set(yearMonth, d.avg_energy);
      }
    });

    const today = new Date();
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const currentDate = new Date(today.getFullYear(), today.getMonth() - i);
      const yearMonth = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
      return monthlyEnergyMap.get(yearMonth) || 0;
    }).reverse(); // Reverse to start from the oldest month

    return monthlyData;
  };

  const getYAxisMinMax = (data) => {
    const allValues = data.flatMap(d => d.data);
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    return { min: minValue, max: maxValue, average: (minValue + maxValue) / 2 };
  };

  const yAxisMinMax = getYAxisMinMax(series);
  const average = yAxisMinMax.average;
  const maxValue = yAxisMinMax.max;
  const topScale = Math.ceil(maxValue) + 1;

  const chartOptions = {
    ...analyticsChartOptions(theme, categories),
    yaxis: {
      ...analyticsChartOptions(theme, categories).yaxis,
      min: yAxisMinMax.min,
      max: topScale,
      tickAmount: 5, // Adjust tickAmount for equal spacing (e.g., 5 ticks)
      forceNiceScale: true, // Ensure the scale is nice and rounded
      labels: {
        ...analyticsChartOptions(theme, categories).yaxis.labels,
        formatter: value => {
          if (average > 5000) {
            return `${(value / 1000).toFixed(0)}K`;
          } else {
            return parseInt(value).toString();
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: value => value.toString() // Show actual value in tooltip
      }
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <FlexBetween>
        <H5>Analytics</H5>
        <StyledSelect
          value={selectType}
          IconComponent={() => <KeyboardArrowDown />}
          onChange={e => {
            setSelectType(e.target.value);
            updateChart(e.target.value, data);
          }}
        >
          <MenuItem value="hourly">Hourly</MenuItem>
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </StyledSelect>
      </FlexBetween>
      <ApexChart type="bar" height={300} series={series} options={chartOptions} />
    </Card>
  );
};

export default AnalyticsEnergy;
