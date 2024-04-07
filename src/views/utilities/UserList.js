import { Grid} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// ==============================|| CONTACT ||============================== //

const UserList = () => (
  <MainCard title="TIÊU ĐỀ">
    <Grid container spacing={gridSpacing}>
      User List
    </Grid>
  </MainCard>
);

export default UserList;
