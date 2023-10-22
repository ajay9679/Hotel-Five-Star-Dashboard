import React, {useEffect} from 'react'
import { useUser } from '../features/authentication/useUser';
import Spinner from './Spinner';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';


const FullPage = styled.div`
    height:100vg;
    background-color: var(--color-grey-50);
    display: flex;
    align-items: center;
    justify-content: center;
`

export default function ProtectedRoute({children}){
    const navigate = useNavigate();
    
    //1 Load auth user
    const {user,isLoading,isAuthenticated} = useUser();

    //3 if there is no auth user, redirect to the /login
    useEffect(function(){
        if(!isAuthenticated && !isLoading) navigate('/login');
    },[isAuthenticated,isLoading,navigate]);

    //2 while loading show spinner
    if(isLoading) return <FullPage><Spinner /></FullPage>

    //4 if there is auth user, render the app.
    if(isAuthenticated) return children;
}
