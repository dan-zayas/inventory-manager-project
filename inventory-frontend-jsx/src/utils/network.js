const BaseUrl = "http://127.0.0.1:8000/"

// Define URLs for different API endpoints
export const LoginUrl = BaseUrl + "user/login"  // URL for user login
export const MeUrl = BaseUrl + "user/me"  // URL for fetching user information
export const CreateUserUrl = BaseUrl + "user/create-user"  // URL for creating a new user
export const UsersUrl = BaseUrl + "user/users"  // URL for fetching all users
export const UpdatePasswordUrl = BaseUrl + "user/update-password"  // URL for updating user password
export const ActivitiesUrl = BaseUrl + "user/activities-log"  // URL for fetching user activities log

export const GroupUrl = BaseUrl + "app/group"  // URL for managing inventory groups
export const InventoryUrl = BaseUrl + "app/inventory"  // URL for managing inventories
export const InventoryCSVUrl = BaseUrl + "app/inventory-csv"  // URL for uploading inventory CSV file
export const ClientUrl = BaseUrl + "app/client"  // URL for managing clients
export const InvoiceUrl = BaseUrl + "app/invoice"  // URL for managing invoices
export const SummaryUrl = BaseUrl + "app/summary"  // URL for fetching summary data
export const TopSellUrl = BaseUrl + "app/top-selling"  // URL for fetching top-selling items
export const ClientSaleUrl = BaseUrl + "app/sales-by-client"  // URL for fetching sales by client data
export const PurchaseSummaryUrl = BaseUrl + "app/purchase-summary"  // URL for fetching purchase summary data

export const CloudinaryUrl = "#"  // URL for Cloudinary (a placeholder URL)
