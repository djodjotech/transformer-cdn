import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Alert,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/types';
import { setSearchTerm, setRegionFilter } from '../store/transformerSlice';

const TransformerTable: React.FC = () => {
  const dispatch = useDispatch();
  const { transformers, searchTerm, regionFilter } = useSelector(
    (state: RootState) => state.transformer,
  );

  const regions = Array.from(new Set(transformers.map((t) => t.region)));

  const filteredTransformers = transformers.filter((transformer) => {
    const matchesSearch = transformer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = !regionFilter || transformer.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search Transformers"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          sx={{ minWidth: { xs: '100%', sm: 200 } }}
        />
        <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
          <InputLabel>Filter by Region</InputLabel>
          <Select
            value={regionFilter}
            label="Filter by Region"
            onChange={(e) => dispatch(setRegionFilter(e.target.value))}
          >
            <MenuItem value="">All Regions</MenuItem>
            {regions.map((region) => (
              <MenuItem key={region} value={region}>
                {region}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {filteredTransformers.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No transformers found matching your search criteria.
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ width: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Region</TableCell>
                <TableCell>Health</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransformers.map((transformer) => (
                <TableRow key={transformer.assetId}>
                  <TableCell>{transformer.name}</TableCell>
                  <TableCell>{transformer.region}</TableCell>
                  <TableCell>{transformer.health}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TransformerTable;
