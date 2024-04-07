import { Grid} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// ==============================|| CONTACT ||============================== //

const PostList = () => (
  <MainCard title="TIÊU ĐỀ">
    <Grid container spacing={gridSpacing}>
      Post List
    </Grid>
  </MainCard>
);

export default PostList;
