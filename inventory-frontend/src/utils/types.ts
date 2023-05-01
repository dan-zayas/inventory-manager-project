import { AxiosError } from "axios";
import React from "react";

// Represents a generic object with flexible value types
export interface DataProps {
    [key: string]: string | boolean | number | DataProps | React.ReactElement | DataProps[] | null
}

// Represents an object for invoice creation add/remove functionality
export interface invoiceCreationAddRemoveProps {
    [key: number]: number
}

// Extends AxiosError to include custom error response shape
export interface CustomAxiosError extends Omit<AxiosError, 'response'> {
    response?: {
        data: {
            error: string
        }
    }
}

// Represents the shape of an Authorization token
export interface AuthTokenType {
    Authorization: string
}

// Represents the shape of a user object
export interface UserType {
    email: string
    fullname: string
    id: string
    created_at: string
    role: string
    last_login: string
}

// Represents optional callbacks for authentication actions
export interface AuthProps {
    errorCallBack?: () => void,
    successCallBack?: () => void,
}

// Represents the shape of the application state
export interface StoreProps {
    user: UserType | null
    updatePasswordUserId: number | null
}

// Represents the available action types for state management
export enum ActionTypes {
    UPDATE_USER_INFO = "[action] update user info",
    UPDATE_PASSWORD_USER_ID = "[action] update password user id"
}

// Represents the shape of the action objects for state management
export type ActionProps = {
    type: ActionTypes.UPDATE_USER_INFO,
    payload: UserType | null
} | {
    type: ActionTypes.UPDATE_PASSWORD_USER_ID,
    payload: number | null
}

// Represents the shape of the context object for the store provider
export interface StoreProviderProps {
    state: StoreProps,
    dispatch: (arg?: ActionProps) => void
}

// Represents the props for a form modal component
export interface FormModalProps {
    isVisible?: boolean
    onSuccessCallBack: (data?: number) => void
    onClose: () => void
}

// Represents the shape of a group object
export interface GroupProps {
    id: number
    name: string
    belongs_to: {
        name: string
        id: number
    } | null
    created_at: string
    total_items: number
}

// Represents the shape of an inventory item object
export interface InventoryProps {
    id: number
    code: string
    name: string
    created_by: {
        email: string
    }
    group: {
        name: string
        id: number
    }
    created_at: string
    remaining: number
    price: number
    photo: string
    total?: number
}

// Represents the shape of an invoice creation item object
export interface InvoiceCreationProps {
    id: number
    item: string
    qty: number
    price: number
    total: number
    action?: React.ReactElement
}

// Represents the shape of a client object
export interface ClientProps {
    created_at: string
    name: string
    created_by: DataProps 
    created_by_email?: string
    id: number
}

// Represents the shape of an invoice object
export interface invoiceType {
    id: number
    created_at: string
    created_by_email: string
    invoice_items: InvoiceCreationProps[]
    shop_name: string
}
