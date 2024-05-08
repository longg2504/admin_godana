import React from 'react';

import { Grid } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import SubCard from 'ui-component/cards/SubCard';
import DataGridPost from '../ui-component/DataGridPost';

// ==============================|| CONTACT ||============================== //

const PostList = () => (
  <MainCard title="POST LIST">
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <SubCard>
          <DataGridPost />
        </SubCard>
      </Grid>
    </Grid>

  </MainCard>
);

export default PostList;
