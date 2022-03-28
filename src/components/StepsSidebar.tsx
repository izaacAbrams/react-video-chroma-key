import React from "react";
import styled from "styled-components";

const StyledSidebar = styled.div`
  background-color: #180229;
  height: 100%;
  width: 40%;
  color: #fff;
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
export const StepsSidebar = () => {
  return (
    <StyledSidebar>
      <li>Step One</li>
      <li>Step Two</li>
      <li>Step Three</li>
      <li>Step Four</li>
    </StyledSidebar>
  );
};
