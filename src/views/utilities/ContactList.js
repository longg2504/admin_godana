import { Grid} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// ==============================|| CONTACT ||============================== //

const ContactList = () => (
  <MainCard title="TIÊU ĐỀ">
    <Grid container spacing={gridSpacing}>
      CONTACT LIST
    </Grid>
  </MainCard>
);

export default ContactList;
