import React, { useEffect, useState } from 'react'
import Form from '../../ui/Form'
import FormRow from '../../ui/FormRow'
import Input from '../../ui/Input'
import Checkbox from '../../ui/Checkbox'
import { useGuests } from './useGuests'
import { useSettings } from './../settings/useSettings'
import styled from 'styled-components'
import { useCabins } from '../cabins/useCabins'
import { useForm } from 'react-hook-form'
import { differenceInDays, isBefore, isDate, startOfToday } from 'date-fns'
import Button from '../../ui/Button'
import toast from 'react-hot-toast'
import { useNewBooking } from './useNewBooking'
import { useNavigate } from 'react-router-dom'

const StyledCheckbox = styled.div`
  display: flex;
  gap: 1.6rem;

  & input[type="checkbox"] {
    height: 2.4rem;
    width: 2.4rem;
    outline-offset: 2px;
    transform-origin: 0;
    accent-color: var(--color-brand-600);
  }

  & input[type="checkbox"]:disabled {
    accent-color: var(--color-brand-600);
  }

  & label {
    flex: 1;

    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
`;

const StyledSelect = styled.select`
    font-size: 1.4rem;
    padding: 0.8rem 1.2rem;
    border: 1px solid
    ${(props) => props.type === "white" ? "var(--color-grey-100)" : "var(--color-grey-300)"};
    border-radius: var(--border-radius-sm);
    background-color: var(--color-grey-0);
    font-weight: 500;
    box-shadow: var(--shadow-sm);
`;

export default function CreateBookingForm(){
    const navigate = useNavigate();
    const [hasBreakfast,setHasbreakfast] = useState(false);
    const [numNight,setNumNight] = useState(0);
    const [numGuests,setNumGuests] = useState(0);
    const [extrasPrice,setExtrasPrice] = useState(0);
    const [isPaid,setIsPaid] = useState(false);
    const [cabinPrice,setCabinPrice] = useState(0);
    const {isLoading:isLoading1,guests} = useGuests();
    const {isLoading:isLoading2,cabins} = useCabins();
    const {isLoading:isLoading3,settings} = useSettings();
    const {isLoading:isCreating,createBooking} = useNewBooking();
    
    function handleCabinPrice(e,numberOfNight){
        console.log('e',e)
        console.log('numberof night',numberOfNight)
        const cabin = cabins.filter(cabin => cabin.id === e)[0];
        const finalCabinPrice = (cabin.regularPrice - cabin.discount) * +numberOfNight;
        console.log('cabin',cabin)
        console.log(finalCabinPrice)
        setCabinPrice(finalCabinPrice);
    }

    useEffect(function(){
        console.log('numNight',numNight)
        const extraPrice = hasBreakfast ? (numNight || 1)*settings.breakfastPrice*numGuests : 0;
        console.log('extra',extraPrice)
        setExtrasPrice(extraPrice);
    },[hasBreakfast,numNight,settings,setExtrasPrice,numGuests]);

    const {register,handleSubmit,formState:{errors},getValues} = useForm();
    function onSubmit(data){
        console.log('Data: ',data);
        console.log(numGuests,numNight)

        const numNightInDifference = differenceInDays(new Date(data.endDate),new Date(data.startDate));
        const today = startOfToday();
        if(numNightInDifference < 1){
            toast.error('start date must be before end date');
            return;
        }
        if(numNightInDifference > settings.maxBookingLength){
            toast.error(`Minimum nights per booking are ${settings.maxBookingLength}`);
            return;
        }
        if(isBefore(new Date(data.startDate), today)){
            toast.error('You cannot start a booking before today.');
            return;
        }
        const reservedCabin = cabins.filter(cabin => cabin.id === +data.cabinId)[0];
        const cabinPrice = (reservedCabin.regularPrice - reservedCabin.discount) * numNightInDifference;
        // setCabinPrice(cabinPrice);
        // const extrasPrice = hasBreakfast ? settings.breakfastPrice * data.numGuests * numNightInDifference : 0;
        const totalPrice = cabinPrice + extrasPrice;
        console.log('total',totalPrice)
        const finalData = {
            ...data,
            cabinPrice,
            extrasPrice,
            totalPrice,
            isPaid,
            hasBreakfast,
            numNights:+numNight,
            observations:data.observations,
            cabinId:+data.cabinId,
            guestId:+data.guestId,
            numGuests:+data.numGuests,
            status:'unconfirmed',
            startDate:new Date(data.startDate).toISOString(),
            endDate:new Date(data.endDate).toISOString(),
        };
        console.log('finalData: ',finalData)
        createBooking(finalData,{onSuccess:() => navigate('/bookings')});
    }

    return <Form onSubmit={handleSubmit(onSubmit)} >
        <FormRow label='Start Date'  >
            <Input type='date' disabled={isCreating} id='startDate' {...register('startDate',{required:'This field is required',validate:isDate(getValues().startDate) || 'You must choose a valid date.'})} />
        </FormRow>
        <FormRow label='End Date' >
            <Input type='date' id='endDate' disabled={isCreating} {...register('endDate',{required:'This field is required',validate:isDate(getValues().endDate) || 'You must choose a valid date.'})} />
        </FormRow>
        <FormRow label='Number of Nights' >
            <Input type='number' disabled={isCreating} id='numNights' {...register('numNights',{onChange:e => setNumNight(e.target.value),required:'This field is required'})} />
        </FormRow>
        <FormRow label='Number of Guests'  >
            <Input type='number' disabled={isCreating} id='numGuests' min={1} {...register('numGuests',{onChange:e => setNumGuests(e.target.value),required:'This field is required',min:{value:1,message:'Minimum number of guests must be 1',max:{value:settings?.maxGuestsPerBooking,message:`Max guests must be ${settings?.maxGuestsPerBooking}`}}})} />
        </FormRow>
        <FormRow label='Cabin Price' >
            <Input type='number' id='cabinPrice' disabled value={cabinPrice} />
        </FormRow>
        <FormRow >
            <StyledCheckbox>
                <label>Want to add Breakfast ?</label>
                <input type='checkbox' disabled={isCreating} id='hasBreakfast' value={hasBreakfast} onChange={() => {
                    setHasbreakfast(breakfast => !breakfast)
                }} />
            </StyledCheckbox>
            {/* <Checkbox id='hasBreakfast' {...register('hasBreakfast')} >
                Want to add breakfast ?
            </Checkbox> */}
        </FormRow>
        <FormRow label='Extra Price' >
            <Input type='text' id='extrasPrice' value={extrasPrice} {...register('extrasPrice',)} disabled />
        </FormRow>
        
        <FormRow >
            <Checkbox id='isPaid' disabled={isCreating} onChange={() => setIsPaid(paid => !paid)} >
                Is paid ?
            </Checkbox>
        </FormRow>
        <FormRow label='Observations' >
            <Input type='text' disabled={isCreating} id='observations' {...register('observations')} />
        </FormRow>
        <FormRow label='Select Guests' >
            <StyledSelect id='guestId' disabled={isCreating} {...register('guestId')} >
            <option value='Select'>Select Guests</option>
                {guests.map(guest => <option key={guest?.id} value={guest?.id} >{`${guest?.fullName} | ${guest?.email} | ${guest?.nationalID}`}</option>)}
            </StyledSelect>
        </FormRow>
        <FormRow label='Select Room' >
            <StyledSelect id='cabinId' disabled={isCreating} {...register('cabinId',{onChange:e => handleCabinPrice(+e.target.value,getValues().numNights)})} >
                <option value='Select'>Select Room</option>
                {cabins.map(cabin => <option key={cabin?.id} value={cabin?.id} >{`${cabin?.name} | max capacity:${cabin?.maxCapacity}`}</option>)}
            </StyledSelect>
        </FormRow>
        <FormRow>
            <Button type='cancel' disabled={isCreating} variation='secondary' >Cancel</Button>
            <Button type='submit' disabled={isCreating} variation='primary' >Submit</Button>
        </FormRow>
    </Form>
}
// {onChange:e => handleCabinPrice(e,getValues().numNight)}