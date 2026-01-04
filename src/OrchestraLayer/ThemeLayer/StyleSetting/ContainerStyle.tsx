import { createTheme } from '@mui/material/styles';
import type {Theme} from "@emotion/react";

const containerTheme:Theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536, // Đây là giá trị mặc định của XL
        },
    },
});
export default containerTheme;