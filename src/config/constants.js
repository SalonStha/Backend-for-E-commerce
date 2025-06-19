const Status = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    DELETED: "Deleted"
};

const UserRole = {
    ADMIN: "Admin", 
    SELLER: "Seller",
    CUSTOMER: "Customer"
};

const Gender = {
    MALE: "Male",
    FEMALE: "Female",
    OTHER: "Other"
};
const OrderStatus = {
    PENDING: "Pending",
    PROCESSING: "Processing",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered"
};

const PaymentMethod = {
    COD: "Cash on Delivery",
    ESEWA: "Esewa",
    KHALTI: "Khalti",
    BANK: "Bank",
    CONNECT_IPS: "Connect IPS",
};

const TransactionStatus = {
    PAID: "Paid",
    PENDING: "Pending",
    REFUNDED: "Refunded",
    PARTIALLY_PAID: "Partially Paid",
}
module.exports = {
    Status,
    UserRole,
    Gender,
    OrderStatus,
    PaymentMethod,
    TransactionStatus
}