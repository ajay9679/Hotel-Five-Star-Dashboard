import React from 'react'
import styled from "styled-components";
import Spinner from '././../../ui/Spinner';

import { useRecentBookings } from './useRecentBookings';
import { useRecentStays } from './useRecentStays';
import { useCabins } from './../cabins/useCabins';

import Stats from './Stats';
import TodayActivity from '../check-in-out/TodayActivity';


const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

export default function DashboardLayout(){
    const {bookings,isLoading:isLoading1} = useRecentBookings();
    const {stays,isLoading:isLoading2,confirmedStays,numDays} = useRecentStays();
    const {cabins,isLoading:isLoading3} = useCabins();
    // console.log(confirmedStays)
    if(isLoading1 || isLoading2 || isLoading3) return <Spinner />
    
    return <StyledDashboardLayout>
        <Stats bookings={bookings} confirmedStays={confirmedStays} numDays={numDays} cabinCount={cabins.length} />
        <TodayActivity />
    </StyledDashboardLayout>
}

