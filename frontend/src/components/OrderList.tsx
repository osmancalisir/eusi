// frontend/src/components/OrderList.tsx

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Box, CircularProgress, Typography, List, ListItem, ListItemText } from "@mui/material";

const OrderList = ({ appTheme }: any) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/orders`);

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }

        const data = await response.json();
        setOrders(data);
      } catch (error: any) {
        toast.error(error.message || "Failed to load orders");
        console.error("Order fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={24} sx={{ color: appTheme.palette.button.bgColor }} />
      </Box>
    );

  if (orders.length === 0)
    return (
      <Typography
        sx={{
          color: appTheme.palette.main.textColor,
          py: 2,
          textAlign: "center",
        }}
      >
        No orders yet
      </Typography>
    );

  return (
    <List sx={{ maxHeight: 300, overflow: "auto" }}>
      {orders.map((order) => (
        <ListItem
          key={order.id}
          sx={{
            borderBottom: "1px solid",
            borderColor: appTheme.palette.icon.hoverColor,
            py: 1,
          }}
        >
          <ListItemText
            primary={
              <Typography
                sx={{
                  color: appTheme.palette.main.textColor,
                  fontWeight: "medium",
                }}
              >
                Order #{order.id}
              </Typography>
            }
            secondary={
              <Box
                component="span"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: appTheme.palette.main.textColor,
                }}
              >
                <Typography component="span" sx={{ color: appTheme.palette.main.textColor }}>
                  {new Date(order.order_date).toLocaleDateString()}
                </Typography>
                <Typography component="span" sx={{ color: appTheme.palette.main.textColor }}>
                  Image: {order.image_id}
                </Typography>
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default OrderList;
