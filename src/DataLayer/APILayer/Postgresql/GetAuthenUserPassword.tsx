import axios from 'axios';
import type { AxiosResponse } from 'axios';
export const getAuthenUserPassword = async (): Promise<AxiosResponse> => axios.get("/main/person/api/1");