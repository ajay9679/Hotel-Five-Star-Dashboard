import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";


export function useEditCabin(){
    const queryClient = useQueryClient();
    const {isLoading:isEditing,mutate:editCabin} = useMutation({
        mutationFn:function({newCabinData,id}){
            createEditCabin(newCabinData,id);
        },
        onSuccess:function(){
            toast.success('Cabin edited successfully');
            queryClient.invalidateQueries({queryKey:['cabins']});
        },
        onError:function(err){
            console.error(err.message);
            toast(err.message);
        },
    });

    return {isEditing,editCabin};
}