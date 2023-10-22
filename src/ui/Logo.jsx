import styled from "styled-components";
import { DarkModeContext } from "../context/DarkModeContext";
import { useContext } from "react";


const StyledLogo = styled.div`
    text-align: center;
`;

const Img = styled.img`
    height: 9.6rem;
    width: auto;
`;

function Logo(){
    const {isDark} = useContext(DarkModeContext);
    const src = isDark ? '/logo-dark.png' : '/logo-light.png';
    return <StyledLogo>
        <Img src={src} alt="Logo" />
    </StyledLogo>
}

export default Logo;
