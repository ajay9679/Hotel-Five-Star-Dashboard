import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCabins as deleteCabinApi } from "../../services/apiCabins";
import toast from "react-hot-toast";


export function useDeleteCabin(){
    const queryClient = useQueryClient();
    const {isLoading:isDeleting,mutate:deleteCabin} = useMutation({
        mutationFn:id => deleteCabinApi(id),
        onSuccess:() => {
            toast.success(`Cabins deleted successfully.`);
            queryClient.invalidateQueries({queryKey:["cabins"]});
        },
        onError:function(err){
            console.error(err.message);
            toast.error(err.message);
        }
    });
    return {isDeleting,deleteCabin};
}