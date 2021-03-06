import { JobsActionTypes } from './jobs.types';
import axios from 'axios';
import { setCurrentPage } from '../pagination/pagination.actions';

export const fetchDataStartAsync = (forced=false) => {
  return async (dispatch, getState) => {
    const { jobs: { isLoaded, fresh } } = getState();
    if (isLoaded && (fresh && !forced)) return;
    
    dispatch(fetchDataStart())
    const { filter: {fullTime, city, searchValue, selectedCity, cityList} } = getState();
    
    let description = null;
    let location = null;
    let full_time = fullTime ? true : null;

    if (searchValue) description = searchValue.trim().length > 1 ? searchValue.trim() : null;
    if (city) location = city.trim().length > 1 ? city.trim() : cityList[selectedCity];
    else location = cityList[selectedCity];

    const params = {
      description,
      location,
      full_time
    }

    try {
      const {data} = await axios.post('http://localhost:5000/jobs', params);
      dispatch(fetchDataSuccess(data));
      dispatch(setCurrentPage(1));
    } catch (error) {
      dispatch(fetchDataFailure(error))
    }

  }
}

export const fetchDataStart = () => ({
  type: JobsActionTypes.FETCH_DATA_START
})

export const fetchDataSuccess = (data) => ({
  type: JobsActionTypes.FETCH_DATA_SUCCESS,
  payload: data
})

export const fetchDataFailure = (error) => ({
  type: JobsActionTypes.FETCH_DATA_FAILURE,
  payload: error
})

