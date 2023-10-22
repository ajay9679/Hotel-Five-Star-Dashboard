import React, { useContext } from 'react'
import ButtonIcon from './ButtonIcon'
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2'
import { DarkModeContext } from '../context/DarkModeContext';


export default function DarkModeToggle(){
    const {isDark,toggleDarkMode} = useContext(DarkModeContext);

    return <ButtonIcon onClick={toggleDarkMode} >
        {isDark ? <HiOutlineSun/> : <HiOutlineMoon />}
    </ButtonIcon>
}
