import { useMutation } from "@tanstack/react-query";
import { newBooking } from "../../services/apiBookings";


export function useNewBooking(){
    const {isLoading,mutate:createBooking} = useMutation({
        mutationFn:(data) => newBooking(data),
    });
    return {isLoading,createBooking}
}