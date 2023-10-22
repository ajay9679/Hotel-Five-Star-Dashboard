import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateCurrentUser } from "../../services/apiAuth";


export function useUpdateUser(){
    const queryClient = useQueryClient();
    const {isLoading:isUpdating,mutate:updateUser} = useMutation({
        mutationFn:updateCurrentUser,
        onSuccess:function(){
            toast.success('User account updated successfully');
            queryClient.invalidateQueries({queryKey:['user']});
        },
        onError:function(err){
            console.error(err.message);
            toast(err.message);
        },
    });

    return {isUpdating,updateUser};
}