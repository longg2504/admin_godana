// material-ui
import { Grid } from '@mui/material';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// =============================|| TABLER ICONS ||============================= //

const TablerIcons = () => (
  <MainCard title="TIÊU ĐỀ">
    <Grid container spacing={gridSpacing}>
      Nội dung
    </Grid>
  </MainCard>
);

export default TablerIcons;
