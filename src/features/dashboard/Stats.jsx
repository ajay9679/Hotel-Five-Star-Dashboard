import React from 'react'
import Stat from './Stat';
import { HiOutlineBanknotes, HiOutlineBriefcase, HiOutlineCalendarDays, HiOutlineChartBar } from "react-icons/hi2";
import { formatCurrency } from '../../utils/helpers';


export default function Stats({bookings,confirmedStays,numDays,cabinCount}){
    const numBookings = bookings.length;
    console.log(bookings)
    const sales = bookings.reduce((acc,curr) => acc + curr.totalPrice,0);
    const checkIns = confirmedStays.length;
    // console.log('occupancy',occupancy / (numDays * cabinCount))
    const occupancy = confirmedStays.reduce((acc,curr) => acc + curr.numNights,0) / (numDays * cabinCount);
    
    return <>
        <Stat title='Bookings' color='blue' icon={<HiOutlineBriefcase/>} value={numBookings} />

        <Stat title='Sales' color='green' icon={<HiOutlineBanknotes/>} value={formatCurrency(sales)} />

        <Stat title='Check Ins' color='indigo' icon={<HiOutlineCalendarDays />} value={checkIns} />

        <Stat title='Occupancy Rate' color='yellow' icon={<HiOutlineChartBar />} value={Math.round(occupancy*100)+'%'} />
    </>
}
