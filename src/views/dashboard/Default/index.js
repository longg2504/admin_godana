import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import TotalPlaceCard from './TotalPlaceCard';
import PopularCategoryPlaceList from './PopularCategoryPlaceList';
import TotalPostCard from './TotalPostCard';
import TotalReviewCard from './TotalReviewCard';
import TotalUserCard from './TotalUserCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import { getAllReport } from 'constant/constURL/URLReport';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({});

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await getAllReport();
        setReportData(response.data);
      } catch (error) {
        console.error('Failed to fetch reports', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalPlaceCard isLoading={isLoading} totalPlace={reportData.countPlace}/>
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalPostCard isLoading={isLoading} totalPost={reportData.countPost}/>
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalReviewCard isLoading={isLoading} totalReview={reportData.countRating}/>
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalUserCard isLoading={isLoading} totalUser={reportData.countUser}/>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularCategoryPlaceList isLoading={isLoading} popularCategories={reportData.countPlacesByCateReport}/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
