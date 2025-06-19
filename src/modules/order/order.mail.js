const userService = require("../user/user.service");
const { UserRole, Status } = require("../../config/constants");
const emailService = require("../../services/email.services");

class OrderMail {
  emailSend = [];
  async sendOrderMail(order, orderDetail) {
    try {
      await this.sendMailToAdmin(order, orderDetail);
      await this.sendMailToCustomer(order, orderDetail);
      await this.sendMailToSeller(order, orderDetail); // Pass the main 'order' object
      const emailStatus = await Promise.allSettled(this.emailSend);
    } catch (error) {
      throw error;
    }
  }

  async sendMailToAdmin(order, orderDetail) {
    try {
      const { data: allAdmins } = await userService.getAllUsers(
        {
          role: UserRole.ADMIN,
          status: Status.ACTIVE,
        },
        {}
      );

      allAdmins.map((admin) => {
        orderDetail.map((item) =>
          this.emailSend.push(
            emailService.sendEmail({
              to: admin.email,
              sub: "New Order Received - Order #" + item.order._id,
              msg: `
<div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; max-width: 700px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">New Order Notification</h1>
    </div>

    <div style="padding: 20px;">
        <p style="font-size: 16px; color: #333333;">A new order has been placed on your website. Please find the details below:</p>

        <div style="margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <h2 style="font-size: 18px; color: #333333; margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #eeeeee; padding-bottom: 10px;">Order Summary</h2>
            <p><strong>Order ID:</strong> ${order.code}</p>
            <p><strong>Customer Name:</strong> ${
              item.buyer.firstName + " " + item.buyer.lastName
            }</p>
            <p><strong>Order Date:</strong> ${new Date(
              order.createdAt
            ).toLocaleString()}</p>
            <p><strong>Order Status:</strong> <span style="color: #007bff; font-weight: bold;">${
              order.status
            }</span></p>
            ${
              order.paymentMethod
                ? `<p><strong>Payment Method:</strong> ${order.paymentMethod}</p>`
                : ""
            }
        </div>

        <div style="margin-bottom: 20px;">
            <h2 style="font-size: 18px; color: #333333; margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #eeeeee; padding-bottom: 10px;">Products Ordered</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 10px;">Product Name</th>
                        <th style="border: 1px solid #dddddd; text-align: center; padding: 10px;">Quantity</th>
                        <th style="border: 1px solid #dddddd; text-align: right; padding: 10px;">Unit Price</th>
                        <th style="border: 1px solid #dddddd; text-align: right; padding: 10px;">Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${
                      orderDetail && orderDetail.length > 0
                        ? orderDetail
                            .map(
                              (item) => `
                        <tr>
                            <td style="border: 1px solid #dddddd; text-align: left; padding: 10px;">${
                              item.product ? item.product.name : "N/A"
                            }</td>
                            <td style="border: 1px solid #dddddd; text-align: center; padding: 10px;">${
                              item.quantity
                            }</td>
                            <td style="border: 1px solid #dddddd; text-align: right; padding: 10px;">NPR ${
                              item.price ? item.price.toFixed(2) / 100 : "0.00"
                            }</td>
                            <td style="border: 1px solid #dddddd; text-align: right; padding: 10px;">NPR ${
                              item.price && item.quantity
                                ? (item.price * item.quantity.toFixed(2)) / 100
                                : "0.00"
                            }</td>
                        </tr>
                    `
                            )
                            .join("")
                        : `<tr><td colspan="4" style="border: 1px solid #dddddd; text-align: center; padding: 10px;">No products found in this order.</td></tr>`
                    }
                </tbody>
            </table>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <h2 style="font-size: 18px; color: #333333; margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #eeeeee; padding-bottom: 10px;">Price Details</h2>
            <table style="width: 100%; font-size: 14px;">
                <tbody>
                    <tr><td style="padding: 5px 0;">Gross Total:</td><td style="text-align: right; padding: 5px 0;">NPR ${
                      order.grossTotal
                        ? order.grossTotal.toFixed(2) / 100
                        : "0.00"
                    }</td></tr>
                    ${
                      order.discount > 0
                        ? `<tr><td style="padding: 5px 0;">Discount:</td><td style="text-align: right; color: #E91E63; padding: 5px 0;">- NPR ${
                            order.discount.toFixed(2) / 100
                          }</td></tr>`
                        : ""
                    }
                    <tr><td style="padding: 5px 0;">Delivery Fee:</td><td style="text-align: right; padding: 5px 0;">NPR ${
                      order.deliveryFee
                        ? order.deliveryFee.toFixed(2) / 100
                        : "0.00"
                    }</td></tr>
                    <tr><td style="padding: 5px 0;">Service Fee:</td><td style="text-align: right; padding: 5px 0;">NPR ${
                      order.serviceFee
                        ? order.serviceFee.toFixed(2) / 100
                        : "0.00"
                    }</td></tr>
                    <tr><td style="padding: 5px 0; font-weight: bold;">SubTotal (after discount & fees):</td><td style="text-align: right; padding: 5px 0; font-weight: bold;">NPR ${
                      order.subTotal ? order.subTotal.toFixed(2) / 100 : "0.00"
                    }</td></tr>
                    <tr><td style="padding: 5px 0;">Tax (13%):</td><td style="text-align: right; padding: 5px 0;">NPR ${
                      order.tax ? order.tax.toFixed(2) / 100 : "0.00"
                    }</td></tr>
                    <tr style="font-weight: bold; font-size: 16px; border-top: 2px solid #eeeeee;">
                        <td style="padding: 10px 0;">Grand Total:</td>
                        <td style="text-align: right; padding: 10px 0;">NPR ${
                          order.total ? order.total.toFixed(2) / 100 : "0.00"
                        }</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <h2 style="font-size: 18px; color: #333333; margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #eeeeee; padding-bottom: 10px;">Shipping Information</h2>
            <p><strong>Address:</strong> ${
              item.buyer.address.shippingAddress
            }</p>
            <p><strong>Contact:</strong> ${item.buyer.phoneNumber}</p>
        </div>
    </div>

    <div style="text-align: center; padding: 15px; background-color: #f0f0f0; border-top: 1px solid #e0e0e0;">
        <p style="color: #7f8c8d; font-size: 12px; margin:0;">This is an automated message. Please do not reply to this email.</p>
        <p style="color: #7f8c8d; font-size: 12px; margin:5px 0 0 0;">You can view this order in the admin panel.</p>
    </div>
</div>
`,
            })
          )
        );
      });
    } catch (error) {
      throw error;
    }
  }
  async sendMailToCustomer(order, orderDetail) {
    try {
      const buyer = order.buyer;
      orderDetail.map((item) =>
        this.emailSend.push(
          emailService.sendEmail({
            to: item.buyer.email,
            sub: "Your Order has been placed - Order No: " + item.order._id,
            msg: `
                        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
                            <h2 style="color: #2c3e50; text-align: center; padding: 20px 0;">Thank you for your order!</h2>
                            <p>Dear ${item.buyer.firstName} ${
              item.buyer.lastName
            },</p>
                            <p>Your order <strong>#${
                              item.order._id
                            }</strong> has been successfully placed on <strong>${new Date(
              order.createdAt
            ).toLocaleString()}</strong>.</p>
                            <h3 style="color: #2c3e50; margin-top: 30px;">Order Summary</h3>
                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                              <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 12px; font-weight: 600;">Product Name</th>
                        <th style="border: 1px solid #dddddd; text-align: center; padding: 12px; font-weight: 600;">Quantity</th>
                        <th style="border: 1px solid #dddddd; text-align: right; padding: 12px; font-weight: 600;">Unit Price (NPR)</th>
                        <th style="border: 1px solid #dddddd; text-align: right; padding: 12px; font-weight: 600;">Item Total (NPR)</th>
                    </tr>
                </thead>   
                </thead>
                                <tbody>
                                    ${
                                      orderDetail && orderDetail.length > 0
                                        ? orderDetail
                                            .map(
                                              (item) => `
                                            <tr>
                                                <td style="border: 1px solid #ddd; padding: 8px;">${
                                                  item.product.name
                                                }</td>
                                                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${
                                                  item.quantity
                                                }</td>
                                                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">NPR ${item.price.toFixed(2)/100}</td>
                                                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">NPR ${
                                                  (item.price *
                                                    item.quantity.toFixed(2)) /
                                                  100
                                                }</td>
                                            </tr>
                                        `
                                            )
                                            .join("")
                                        : `<tr><td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: center;">No products found.</td></tr>`
                                    }
                                </tbody>
                            </table>

                            <div style="margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <h2 style="font-size: 18px; color: #333333; margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #eeeeee; padding-bottom: 10px;">Price Details</h2>
            <table style="width: 100%; font-size: 14px;">
                <tbody>
                    <tr><td style="padding: 5px 0;">Gross Total:</td><td style="text-align: right; padding: 5px 0;">NPR ${
                      order.grossTotal
                        ? order.grossTotal.toFixed(2) / 100
                        : "0.00"
                    }</td></tr>
                    ${
                      order.discount > 0
                        ? `<tr><td style="padding: 5px 0;">Discount:</td><td style="text-align: right; color: #E91E63; padding: 5px 0;">- NPR ${
                            order.discount.toFixed(2) / 100
                          }</td></tr>`
                        : ""
                    }
                    <tr><td style="padding: 5px 0;">Delivery Fee:</td><td style="text-align: right; padding: 5px 0;">NPR ${
                      order.deliveryFee
                        ? order.deliveryFee.toFixed(2) / 100
                        : "0.00"
                    }</td></tr>
                    <tr><td style="padding: 5px 0;">Service Fee:</td><td style="text-align: right; padding: 5px 0;">NPR ${
                      order.serviceFee
                        ? order.serviceFee.toFixed(2) / 100
                        : "0.00"
                    }</td></tr>
                    <tr><td style="padding: 5px 0; font-weight: bold;">SubTotal (after discount & fees):</td><td style="text-align: right; padding: 5px 0; font-weight: bold;">NPR ${
                      order.subTotal ? order.subTotal.toFixed(2) / 100 : "0.00"
                    }</td></tr>
                    <tr><td style="padding: 5px 0;">Tax (13%):</td><td style="text-align: right; padding: 5px 0;">NPR ${
                      order.tax ? order.tax.toFixed(2) / 100 : "0.00"
                    }</td></tr>
                    <tr style="font-weight: bold; font-size: 16px; border-top: 2px solid #eeeeee;">
                        <td style="padding: 10px 0;">Grand Total:</td>
                        <td style="text-align: right; padding: 10px 0;">NPR ${
                          order.total ? order.total.toFixed(2) / 100 : "0.00"
                        }</td>
                    </tr>
                </tbody>
            </table>
        </div>

                            <h3 style="color: #2c3e50; margin-top: 30px;">Shipping Information</h3>
                            <p>
                                <strong>Address:</strong> ${
                                  item.buyer.address.shippingAddress
                                }<br>
                                <strong>Contact:</strong> ${
                                  item.buyer.phoneNumber
                                }
                            </p>
                            <p>
                                <strong>Payment Method:</strong> ${
                                  item.order.paymentMethod
                                }<br>
                                <strong>Order Status:</strong> ${order.status}
                            </p>
                            <div style="text-align: center; margin-top: 30px;">
                                <p style="color: #7f8c8d;">If you have any questions, please contact our support team.<br>
                                This is an automated message. Please do not reply to this email.</p>
                            </div>
                        </div>
                    `,
          })
        )
      );
    } catch (error) {
      throw error;
    }
  }
  async sendMailToSeller(order, orderDetail) {
    // Added 'order' parameter
    try {
      orderDetail.map((item) => {
        this.emailSend.push(
          emailService.sendEmail({
            to: item.seller.email,
            sub: `New Order for Your Product - Order #${order.code}`,
            msg: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 20px auto; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #27ae60; color: white; padding: 25px; text-align: center;">
        <h1 style="margin: 0; font-size: 26px; font-weight: 600;">New Order for Your Product!</h1>
    </div>

    <div style="padding: 25px; color: #333;">
        <p style="font-size: 17px; margin-bottom: 15px;">Dear ${
          item.seller.firstName
        } ${item.seller.lastName},</p>
        <p style="font-size: 16px; line-height: 1.6;">Congratulations! An item you listed has been sold as part of Order <strong>#${
          order.code
        }</strong>. Please find the details below and prepare the item for shipment as soon as possible.</p>

        <div style="margin-top: 25px; margin-bottom: 25px; padding: 20px; background-color: #ffffff; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="font-size: 20px; color: #27ae60; margin-top: 0; margin-bottom: 18px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Item & Order Details</h2>
            <p style="font-size: 15px; margin-bottom: 8px;"><strong>Order ID:</strong> ${
              order.code
            }</p>
            <p style="font-size: 15px; margin-bottom: 8px;"><strong>Order Date:</strong> ${new Date(
              order.createdAt
            ).toLocaleString()}</p>
            <p style="font-size: 15px; margin-bottom: 20px;"><strong>Your Item Status:</strong> <span style="color: #007bff; font-weight: bold;">${
              item.status
            }</span></p>

            <h3 style="font-size: 18px; color: #333; margin-top: 20px; margin-bottom: 10px;">Product Sold:</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 12px; font-weight: 600;">Product Name</th>
                        <th style="border: 1px solid #dddddd; text-align: center; padding: 12px; font-weight: 600;">Quantity</th>
                        <th style="border: 1px solid #dddddd; text-align: right; padding: 12px; font-weight: 600;">Unit Price (NPR)</th>
                        <th style="border: 1px solid #dddddd; text-align: right; padding: 12px; font-weight: 600;">Item Total (NPR)</th>
                    </tr>
                </thead>
              <tbody>
                                    ${
                                      orderDetail && orderDetail.length > 0
                                        ? orderDetail
                                            .map(
                                              (item) => `
                                            <tr>
                                                <td style="border: 1px solid #ddd; padding: 8px;">${
                                                  item.product.name
                                                }</td>
                                                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${
                                                  item.quantity
                                                }</td>
                                                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">NPR ${item.price.toFixed(2)/100}</td>
                                                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">NPR ${
                                                  (item.price *
                                                    item.quantity.toFixed(2)) /
                                                  100
                                                }</td>
                                            </tr>
                                        `
                                            )
                                            .join("")
                                        : `<tr><td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: center;">No products found.</td></tr>`
                                    }
                                </tbody>
            </table>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <h2 style="font-size: 18px; color: #333333; margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #eeeeee; padding-bottom: 10px;">Price Details</h2>
            <table style="width: 100%; font-size: 14px;">
                <tbody>
                    <tr><td style="padding: 5px 0;">Sub Total:</td><td style="text-align: right; padding: 5px 0;">NPR ${
                      item.subTotal
                        ? item.subTotal.toFixed(2) / 100
                        : "0.00"
                    }</td></tr
                    <tr><td style="padding: 5px 0;">Delivery Fee:</td><td style="text-align: right; padding: 5px 0;">NPR ${
                      order.deliveryFee
                        ? order.deliveryFee.toFixed(2) / 100
                        : "0.00"
                    }</td></tr>
                    <tr><td style="padding: 5px 0; font-weight: bold;">SubTotal (after discount & fees):</td><td style="text-align: right; padding: 5px 0; font-weight: bold;">NPR ${
                      order.subTotal ? order.subTotal.toFixed(2) / 100 : "0.00"
                    }</td></tr>
                    <tr><td style="padding: 5px 0;">Tax (13%):</td><td style="text-align: right; padding: 5px 0;">NPR ${
                      order.tax ? order.tax.toFixed(2) / 100 : "0.00"
                    }</td></tr>
                    <tr style="font-weight: bold; font-size: 16px; border-top: 2px solid #eeeeee;">
                        <td style="padding: 10px 0;">Grand Total:</td>
                        <td style="text-align: right; padding: 10px 0;">NPR ${
                          order.total ? order.total.toFixed(2) / 100 : "0.00"
                        }</td>
                    </tr>
                </tbody>
            </table>
        </div>


        <div style="margin-bottom: 25px; padding: 20px; background-color: #ffffff; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="font-size: 20px; color: #27ae60; margin-top: 0; margin-bottom: 18px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Ship To:</h2>
            <p style="font-size: 15px; margin-bottom: 8px;"><strong>Customer Name:</strong> ${
              item.buyer.firstName
            } ${item.buyer.lastName}</p>
            <p style="font-size: 15px; margin-bottom: 8px;"><strong>Shipping Address:</strong> ${
              item.buyer.address && item.buyer.address.shippingAddress
                ? item.buyer.address.shippingAddress
                : "N/A"
            }</p>
            <p style="font-size: 15px; margin-bottom: 8px;"><strong>Contact Number:</strong> ${
              item.buyer.phoneNumber || "N/A"
            }</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding: 15px; background-color: #e6ffed; border: 1px solid #b2dfc8; border-radius: 5px;">
            <h3 style="color: #1e824c; font-size: 18px; margin-top:0; margin-bottom:10px;">Action Required!</h3>
            <p style="font-size: 16px; line-height: 1.6;">Please ensure the item is packaged securely and dispatched promptly to the customer. You can manage your orders and update shipping status through your seller dashboard.</p>
            <!-- Optional: Link to seller dashboard -->
            <!-- <a href="YOUR_SELLER_DASHBOARD_URL" style="display: inline-block; background-color: #27ae60; color: white; padding: 12px 25px; text-decoration: none; font-size: 16px; border-radius: 5px; margin-top: 15px; font-weight: bold;">Go to My Orders</a> -->
        </div>
    </div>

    <div style="text-align: center; padding: 20px; background-color: #e9ecef; border-top: 1px solid #ddd;">
        <p style="color: #6c757d; font-size: 13px; margin:0;">This is an automated message. Please do not reply to this email.</p>
        <p style="color: #6c757d; font-size: 13px; margin:5px 0 0 0;">Thank you for selling with us!</p>
    </div>
</div>
                        `,
          })
        );
      });
    } catch (error) {
      throw error;
    }
  }
}

const orderMail = new OrderMail();

module.exports = orderMail;
