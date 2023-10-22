import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";


const PAGE_SIZE = 10;
export function useBookings(){
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const filterValue = searchParams.get('status');
    const filter = !filterValue || filterValue === 'all' ? null : {field:'status',value:filterValue};
    const sortByRaw = searchParams.get('sortBy') || 'startDate-desc';
    const [field,direction] = sortByRaw.split('-');
    const sortBy = {field,direction};
    const page = !searchParams.get('page') ? 1 : +searchParams.get('page');
    const {isLoading,data:{data:bookings,count} = {}} = useQuery({
        queryKey:['bookings',filterValue,sortBy,page],
        queryFn:() => getBookings({filter:filter,sortBy:sortBy,page})
    });

    //PRE FETCH
    const pageCount = Math.ceil(count / PAGE_SIZE);
    if(page < pageCount)
        queryClient.prefetchQuery({
            queryKey:['bookings',filterValue,sortBy,page+1],
            queryFn:() => getBookings({filter:filter,sortBy:sortBy,page:page+1})
        });
    if(page > 1)
        queryClient.prefetchQuery({
            queryKey:['bookings',filterValue,sortBy,page-1],
            queryFn:() => getBookings({filter:filter,sortBy:sortBy,page:page-1})
        });
    return {isLoading,bookings,count};
}