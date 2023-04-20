import { AxiosError } from "axios";
import React from "react";

export interface DataProps {
    [key: string]: string | boolean | number | DataProps | React.ReactElement | DataProps[] | null
}


export interface CustomAxiosError extends Omit<AxiosError, 'response'> {
    response?: {
        data: {
            error: string
        }
    }
}