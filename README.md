# inventory-manager-project
Code Platoon Capstone Solo Project

Inventory Manager Capstone Project
- This React/Django web app is an admin dashboard where a company can manage inventory of materials/goods for sale to third-party businesses.

#functionalities
NAVIGATION
- Dashboard
- Full Inventory List
- Inventory Categories
- Invoices
- Users
- Clients
- User Activity

DASHBOARD
- Total count of Items, Categories, Users, and Clients
- Top Selling Items
- Sales to date
- Pie Graph and Chart showing the top clients

INVENTORY
- Create, Read, Update, Delete Items
- Upload multiple items via CSV
- Adjust quantities of items

CATEGORIES
- Create, Read, Update, Delete Categories
- Parent/Child relationship for Categories
- Display item count within each Category

QUOTES
- STRIPE API INTEGRATION FOR QUOTES
- Create, Read, Update, Delete Quotes
- Issue Quotes to clients, creating a quote object
- Allow clients to accept a quote, which automatically creates an invoice and decrements items

INVOICING
- STRIPE API INTEGRATION FOR INVOICES
- Create, Read, Update, Delete Invoices
- Issue inventory to clients, creating an invoice object and decrementing items
- Display paid status

CLIENTS
- Create, Read, Update, Delete Clients

USERS
- FIREBASE API FOR USER LOGIN/DATA MAANGEMENT
- Create, Read, Update, Delete Users
- Maintain role management with activity permissions
- Display last log on / Created on

USER ACTIVITY LOG
- Log every action taken by each user with timestamp

#stretch
- Implement Typescript for this project as a stretch goal
- Pagination for each list display (Items, Categories, Users, Clients)
- Implement payment processing through STRIPE API
