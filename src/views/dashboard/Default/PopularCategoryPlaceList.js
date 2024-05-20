import PropTypes from 'prop-types';
import { useState } from 'react';
import { Button, CardActions, CardContent, Divider, Grid, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const PopularCategoryPlaceList = ({ isLoading , popularCategories}) => {
  const [showAll, setShowAll] = useState(false);

  const handleViewAll = () => {
    setShowAll(!showAll);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Typography variant="h4">Popular Category</Typography>
              </Grid>
              {(showAll ? popularCategories : popularCategories.slice(0, 8)).map((category, index) => (
                <Grid item xs={12} key={index}>
                  <Divider sx={{ my: 1.5 }} />
                  <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                      <Typography variant="subtitle1" color="inherit" sx={{mt: 1, mb:-1, ml:2}}>
                        {category.categoryName}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" color="inherit" sx={{mt: 1, mb:-1, mr: 2  }}>
                        {category.count}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </CardContent>
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button size="small" disableElevation onClick={handleViewAll}>
              {showAll ? 'Hide' : 'View All'}
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
};

PopularCategoryPlaceList.propTypes = {
  isLoading: PropTypes.bool,
  popularCategories: PropTypes.array
};

export default PopularCategoryPlaceList;
