import { IconButton, ThemeProvider } from '@mui/material';
import React, { Children } from 'react';
import containerTheme from './StyleSetting/ContainerStyle.tsx';
import type {ChildrenInterface as ChildrenComponent} from '../ChildrenComponent.tsx';
const ThemeMaster:React.FC<ChildrenComponent>=({children})=>{
return (
<ThemeProvider theme={containerTheme}>
{children}
</ThemeProvider>
);
}
export default ThemeMaster;