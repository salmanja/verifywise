import React, { useState } from "react";
import { ButtonGroup, Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/system";

interface StyledButtonProps extends ButtonProps {
  isSelected?: boolean;
  isAllButton?: boolean;
}

const StyledButtonGroup = styled(ButtonGroup)({
  borderRadius: "4px",
  overflow: "hidden",
  height: "34px",
});

/**
 * A styled button component that customizes the appearance of a button based on its props.
 *
 * @param {StyledButtonProps} props - The properties used to style the button.
 * @param {object} props.theme - The theme object provided by the styled-components ThemeProvider.
 * @param {boolean} props.isSelected - Determines if the button is selected.
 * @param {boolean} props.isAllButton - Determines if the button is an "all" button.
 *
 * @returns {JSX.Element} A styled button component.
 *
 * @example
 * <StyledButton isSelected={true} isAllButton={false}>Button</StyledButton>
 */
const StyledButton = styled(Button)<StyledButtonProps>(
  ({ theme, isSelected, isAllButton }) => ({
    color: isAllButton
      ? "black"
      : isSelected
      ? theme.palette.text.primary
      : theme.palette.text.secondary,
    backgroundColor: isSelected ? "#F4F5F7" : theme.palette.background.paper,
    fontWeight: isSelected ? "600" : "normal",
    fontSize: "11px",
    border: "1px solid rgba(234, 236, 240, 1)",
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
    },
    padding: "8px 16px",
    textTransform: "none",
  })
);

const RoleButtonGroup: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>("All");

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };

  return (
    <StyledButtonGroup
      variant="outlined"
      aria-label="role selection button group"
    >
      {["All", "Administrator", "Editor", "Reviewer"].map((role) => (
        <StyledButton
          key={role}
          onClick={() => handleRoleChange(role)}
          isSelected={selectedRole === role}
        >
          {role}
        </StyledButton>
      ))}
    </StyledButtonGroup>
  );
};

export default RoleButtonGroup;
