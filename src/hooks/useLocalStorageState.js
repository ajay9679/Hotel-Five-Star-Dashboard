import { useState, useEffect } from "react";


export function useLocalStorageState(initialState, key) {
    const [value, setValue] = useState(function(){
        const storedValue = window.localStorage.getItem(key);
        console.log(storedValue)
        return storedValue ? JSON.parse(storedValue) : initialState;
    });

    useEffect(function(){
        window.localStorage.setItem(key,JSON.stringify(value));
    },[value,key]);
    return [value, setValue];
}
