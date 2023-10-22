import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking as deleteBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";


export function useDeleteBooking(){
    const queryClient = useQueryClient();
    const {isLoading:isDeleting,mutate:deleteBooking} = useMutation({
        mutationFn:id => deleteBookingApi(id),
        onSuccess:() => {
            toast.success(`Booking deleted successfully.`);
            queryClient.invalidateQueries({queryKey:["bookings"]});
        },
        onError:function(err){
            console.error(err.message);
            toast.error(err.message);
        }
    });
    return {isDeleting,deleteBooking};
}