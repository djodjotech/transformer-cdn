import React, { useMemo, useEffect } from 'react';
import { Box, FormGroup, FormControlLabel, Checkbox, Paper, CircularProgress } from '@mui/material';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
} from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/types';
import { toggleTransformer } from '../store/transformerSlice';
import type { Transformer } from '../types/transformer';

// Constants
const CHART_CONFIG = {
  colors: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'],
  height: 500,
  margin: { top: 5, right: 30, left: 20, bottom: 5 },
} as const;

// Helper functions
const findVoltageForTimestamp = (transformer: Transformer, timestamp: string): string | undefined =>
  transformer.lastTenVoltgageReadings.find((r) => r.timestamp === timestamp)?.voltage;

const createChartDataPoint = (reading: { timestamp: string }, transformers: Transformer[]) => ({
  timestamp: reading.timestamp,
  ...transformers.reduce(
    (acc, transformer) => ({
      ...acc,
      [transformer.name]: findVoltageForTimestamp(transformer, reading.timestamp),
    }),
    {},
  ),
});

// Loading component
const LoadingSpinner: React.FC = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <CircularProgress />
  </Box>
);

const VoltageChart: React.FC = () => {
  const dispatch = useDispatch();
  const { transformers, selectedTransformers } = useSelector(
    (state: RootState) => state.transformer,
  );

  // Select all transformers by default only on first load
  useEffect(() => {
    const storedTransformers = localStorage.getItem('selectedTransformers');
    if (!storedTransformers && transformers.length > 0 && selectedTransformers.length === 0) {
      const allTransformerIds = transformers.map((t) => t.assetId);
      allTransformerIds.forEach((id) => {
        dispatch(toggleTransformer(id));
      });
    }
  }, [dispatch, transformers, selectedTransformers.length]);

  const handleTransformerToggle = (assetId: number) => {
    try {
      dispatch(toggleTransformer(assetId));
    } catch (error) {
      console.error('Error toggling transformer:', error);
    }
  };

  const sortedTransformers = useMemo(
    () =>
      transformers.map((transformer) => ({
        ...transformer,
        lastTenVoltgageReadings: [...transformer.lastTenVoltgageReadings].reverse(),
      })),
    [transformers],
  );

  // Create a single data source for the chart
  const baseData = useMemo(
    () =>
      sortedTransformers[0]?.lastTenVoltgageReadings.map((reading) =>
        createChartDataPoint(reading, sortedTransformers),
      ) || [],
    [sortedTransformers],
  );

  if (transformers.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ width: '100%', height: CHART_CONFIG.height }}>
      <Paper sx={{ p: 2, mb: 2, width: '100%' }}>
        <FormGroup row sx={{ flexWrap: 'wrap', gap: 1 }}>
          {sortedTransformers.map((transformer, index) => (
            <FormControlLabel
              key={transformer.assetId}
              control={
                <Checkbox
                  checked={selectedTransformers.includes(transformer.assetId)}
                  onChange={() => handleTransformerToggle(transformer.assetId)}
                  sx={{
                    color: CHART_CONFIG.colors[index % CHART_CONFIG.colors.length],
                    '&.Mui-checked': {
                      color: CHART_CONFIG.colors[index % CHART_CONFIG.colors.length],
                    },
                  }}
                />
              }
              label={transformer.name}
            />
          ))}
        </FormGroup>
      </Paper>
      <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={baseData} margin={CHART_CONFIG.margin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(timestamp: string) => new Date(timestamp).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(timestamp: string) => new Date(timestamp).toLocaleString()}
              formatter={(value: string) => [`${value}V`, 'Voltage']}
            />
            <Legend />
            {sortedTransformers.map((transformer, index) => {
              if (!selectedTransformers.includes(transformer.assetId)) return null;
              return (
                <Line
                  key={transformer.assetId}
                  type="monotone"
                  dataKey={transformer.name}
                  name={transformer.name}
                  stroke={CHART_CONFIG.colors[index % CHART_CONFIG.colors.length]}
                  dot={false}
                  strokeWidth={2}
                  connectNulls
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default VoltageChart;
