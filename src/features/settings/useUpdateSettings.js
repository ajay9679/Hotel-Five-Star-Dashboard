import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateSetting as updateSettingApi } from "../../services/apiSettings";


export function useUpdateSettings(){
    const queryClient = useQueryClient();
    const {isLoading:isUpdating,mutate:updateSettings} = useMutation({
        mutationFn:function(obj){
            updateSettingApi(obj);
        },
        onSuccess:function(){
            toast.success('Setting updated successfully');
            queryClient.invalidateQueries({queryKey:['settings']});
        },
        onError:function(err){
            console.error(err.message);
            toast(err.message);
        },
    });

    return {isUpdating,updateSettings};
}

