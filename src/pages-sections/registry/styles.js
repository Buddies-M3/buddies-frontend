import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

// Styled Button Component
const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '50px', // Fully rounded corners
    backgroundColor: '#000', // Black background
    color: '#fff', // White text
    padding: '8px 24px', // Adjust padding for size
    '&:hover': {
      backgroundColor: '#333', // Darker black on hover
    },
  }));