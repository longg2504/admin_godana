import { Grid} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// ==============================|| TYPOGRAPHY ||============================== //

const Typography = () => (
  <MainCard title="TIÊU ĐỀ">
    <Grid container spacing={gridSpacing}>
      Nội dung
    </Grid>
  </MainCard>
);

export default Typography;
