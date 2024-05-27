import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
import chartData from './chart-data/total-growth-bar-chart';

// Utility functions for date formatting
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

const formatMonthYear = (date) => {
  const options = { year: 'numeric', month: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

const formatYear = (date) => {
  const options = { year: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

const formatLastSixMonths = () => {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setMonth(today.getMonth() - 6);

  return `${formatMonthYear(pastDate)} - ${formatMonthYear(today)}`;
};

const statusOptions = [
  { value: 'day', label: 'Today' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'sixMonths', label: 'Last 6 Months' }
];

const seriesOptions = [
  { value: 'place', label: 'Place' },
  { value: 'user', label: 'User' }
];

const TotalGrowthBarChart = ({ isLoading, reportData }) => {
  const [status, setStatus] = useState('day');
  const [series, setSeries] = useState('place');
  const [timePeriod, setTimePeriod] = useState(formatDate(new Date()));
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);

  const { navType } = customization;
  const { primary } = theme.palette.text;
  const darkLight = theme.palette.dark.light;
  const grey200 = theme.palette.grey[200];
  const grey500 = theme.palette.grey[500];

  const primary200 = theme.palette.primary[200];
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;

  useEffect(() => {
    if (!reportData) return;

    const categories = getCategories(status, reportData, series);
    const data = getData(status, reportData, series);

    const newChartData = {
      ...chartData(categories, data).options,
      colors: [primary200, primaryDark, secondaryMain, secondaryLight],
      xaxis: {
        labels: {
          style: {
            colors: Array(categories.length).fill(primary)
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary]
          }
        }
      },
      grid: {
        borderColor: grey200
      },
      tooltip: {
        theme: 'light'
      },
      legend: {
        labels: {
          colors: grey500
        }
      }
    };

    if (!isLoading) {
      ApexCharts.exec('bar-chart', 'updateOptions', newChartData);
    }
  }, [status, series, navType, primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, grey200, isLoading, grey500, reportData]);

  useEffect(() => {
    switch (status) {
      case 'day':
        setTimePeriod(formatDate(new Date()));
        break;
      case 'month':
        setTimePeriod(formatMonthYear(new Date()));
        break;
      case 'year':
        setTimePeriod(formatYear(new Date()));
        break;
      case 'sixMonths':
        setTimePeriod(formatLastSixMonths());
        break;
      default:
        setTimePeriod(formatDate(new Date()));
    }
  }, [status]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="h3">Report Chart</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Typography variant="h3" style={{ marginRight: '10px' }}>
                    {timePeriod}
                  </Typography>
                <Grid item>
                  
                  <TextField
                    id="status-select"
                    select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ marginRight: '10px' }}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    id="series-select"
                    select
                    value={series}
                    onChange={(e) => setSeries(e.target.value)}
                  >
                    {seriesOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Chart {...chartData(getCategories(status, reportData, series), getData(status, reportData, series))} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool,
  reportData: PropTypes.object.isRequired
};

export default TotalGrowthBarChart;

const getCategories = (status, reportData, series) => {
  if (status === 'day') return ['Today'];
  if (status === 'month') return ['This Month'];
  if (status === 'year') return reportData[`year${capitalize(series)}sReport`]?.map((data) => `Month ${data.month}`) || [];
  if (status === 'sixMonths') return reportData[`${series}SixMonthAgoReport`]?.map((data) => `${data.month}/${data.year}`) || [];
  return [];
};

const getData = (status, reportData, series) => {
  if (status === 'day') return [{ name: series, data: [reportData[`day${capitalize(series)}sReport`]?.count || 0] }];
  if (status === 'month') return [{ name: series, data: [reportData[`month${capitalize(series)}sReport`]?.count || 0] }];
  if (status === 'year') return [{ name: series, data: reportData[`year${capitalize(series)}sReport`]?.map((data) => data.count) || [] }];
  if (status === 'sixMonths') return [{ name: series, data: reportData[`${series}SixMonthAgoReport`]?.map((data) => data.count) || [] }];

  console.log(reportData[`day${capitalize(series)}sReport`].count);
  console.log(reportData[`month${capitalize(series)}sReport`].count);
  console.log(reportData[`year${capitalize(series)}sReport`]?.map((data) => data.count));
  console.log(reportData[`${series}SixMonthAgoReport`]?.map((data) => data.count));
  return [];
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
