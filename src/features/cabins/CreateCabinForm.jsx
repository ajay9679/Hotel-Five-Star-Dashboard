import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";
import FormRow from "../../ui/FormRow";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";


function CreateCabinForm({cabinToEdit={},onCloseModal}){
    const {id:editId,...editValues} = cabinToEdit;
    console.log(editValues);
    const isEditSession = Boolean(editId);
    const {register,handleSubmit,reset,getValues,formState} = useForm({defaultValues:isEditSession ? editValues : {}});
    const {errors} = formState;
    const {isCreating,createCabin} = useCreateCabin();
    const {isEditing,editCabin} = useEditCabin();
    
    const isWorking = isCreating || isEditing;

    function onSubmit(data){
        console.log(data)
        const image = typeof data.image === 'string' ? data.image : data.image[0];
        // console.log({...data,image:data.image[0]})
        if(isEditSession) editCabin({newCabinData:{...data,image:image},id:editId},{onSuccess:function(data){reset();onCloseModal?.()}});
        else createCabin({...data,image:image},{onSuccess:function(data){reset();onCloseModal?.()}});
    }

    function onError(errors){
        console.error(errors);
    }
    
    return <Form onSubmit={handleSubmit(onSubmit,onError)} type={onCloseModal ? 'modal' : 'regular'} >
        <FormRow label='Cabin name' errorMessage={errors?.name?.message} >
            <Input type="text" disabled={isWorking} id="name" {...register('name',{required:'This field is required.'})} />
        </FormRow>

        <FormRow label='Maximum capacity' errorMessage={errors?.maxCapacity?.message} >
            <Input disabled={isWorking} type="text" id="maxCapacity" {...register('maxCapacity',{required:'This field is required.',min:{value:1,message:'Capacity should be atleast 1'}})} />
        </FormRow>

        <FormRow label='Regular Price' error={errors?.regularPrice?.message}>
            <Input type="text" disabled={isWorking} id="regularPrice" {...register('regularPrice',{required:'This field is required',min:{value:1,message:'Capacity should be atleast 1'}})} />
        </FormRow>

        <FormRow label='Discount' error={errors?.discount?.message}>
            <Input type="text" disabled={isWorking} defaultValue={0} id="discount" {...register('discount',{required:'This field is required',validate:value => value <= getValues().regularPrice || 'Discount should be less than regular price.'})} />
        </FormRow>

        <FormRow label='Description for website' >
            <Textarea type="number" disabled={isWorking} id="description" defaultValue="" {...register('description',{required:'This field is required'})} />
        </FormRow>

        <FormRow label='Cabin photo' >
            <FileInput id="image" type="file" accept="image/*" {...register('image',{required:isEditSession ? false : 'This field is required'})} />
        </FormRow>

        <FormRow>
            {/* type is an HTML attribute! */}
            <Button variation="secondary" onClick={() => onCloseModal?.()} type="reset">
                Cancel
            </Button>
            <Button disabled={isWorking} >{isEditSession ? 'Edit' : 'Create cabin'}</Button>
        </FormRow>
    </Form>
}

export default CreateCabinForm;
