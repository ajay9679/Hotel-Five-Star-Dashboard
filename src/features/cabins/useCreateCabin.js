import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";


export function useCreateCabin(){
    const queryClient = useQueryClient();
    const {isLoading:isCreating,mutate:createCabin} = useMutation({
        mutationFn:function(newCabin){
            createEditCabin(newCabin);
        },
        onSuccess:function(){
            toast.success('Cabin created successfully');
            queryClient.invalidateQueries({queryKey:['cabins']});
        },
        onError:function(err){
            console.error(err.message);
            toast(err.message);
        },
    });

    return {isCreating,createCabin};
}