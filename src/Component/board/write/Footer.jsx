import { styled } from "styled-components";

const FooterContainer = styled.div`
    flex: 1;
    justify-content: center;
    align-items: center;

    margin-left: 5%;
    margin-right: 5%;
    margin-top: 30px;
    margin-bottom: 50px;

    display: grid;
    grid-template-columns: 1fr 1fr;
`
;

const FooterCategory = styled.div`
    display: grid;
    grid-column-gap: 10px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
`
;

const FooterSaveBtn = styled.div`
    display: grid;
    grid-column-gap: 10px;
    grid-template-columns: 1fr 1fr;
    justify-items: end;
`
;


export {FooterContainer,FooterCategory,FooterSaveBtn}