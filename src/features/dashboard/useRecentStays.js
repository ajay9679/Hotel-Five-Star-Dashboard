import { useQuery } from "@tanstack/react-query";
import { sub, subDays } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { getBookingsAfterDate, getStaysAfterDate } from "../../services/apiBookings";


export function useRecentStays(){
    const [searchParams] = useSearchParams();
    const numDays = !searchParams.get('last') ? 7 : +searchParams.get('last');
    // console.log('numDays',subDays(new Date(), numDays))
    const queryDate = subDays(new Date(),numDays).toISOString();
    const {isLoading,data:stays} = useQuery({
        queryFn:() => getStaysAfterDate(queryDate),
        queryKey:['stays',`last-${numDays}`],
    });
    const confirmedStays = stays?.filter(stay => stay.status === 'checked-in' || stay.status === 'checked-out');
    // console.log(confirmedStays)
    // console.log('stays',stays)

    return {isLoading,stays,confirmedStays,numDays};
}