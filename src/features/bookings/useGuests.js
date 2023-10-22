import { useQuery } from "@tanstack/react-query";
import { getGuest } from "../../services/apiAuth";

export function useGuests(){
    const {isLoading,data:guests=[]} = useQuery({
        queryFn:getGuest,
        queryKey:['guests'],
    });
    return {isLoading,guests};
}