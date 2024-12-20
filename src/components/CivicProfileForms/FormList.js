import BasicInfo from './BasicInfo';
// import FinancialInfo from './FinancialInfo';
import HousingInfo from './HousingInfo';

const CIVIC_FORM_LIST = [
  { path: 'basic-info', label: 'Basic Information', element: BasicInfo, key: 'basic_info' },
  { path: 'housing-info', label: 'Housing Information', element: HousingInfo, key: 'housing_info' }
  // {
  //   path: 'financial-info',
  //   label: 'Financial Information',
  //   element: FinancialInfo,
  //   key: 'financial_info'
  // }
];

export default CIVIC_FORM_LIST;
