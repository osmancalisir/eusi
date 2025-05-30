// frontend/src/components/OrderList.tsx

import { Box, CircularProgress, Typography, List, ListItem, ListItemText } from "@mui/material";

const OrderList = ({ appTheme, orders, loading }: { appTheme: any; orders: any[]; loading: boolean }) => {
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
    <List sx={{ overflow: "auto", maxHeight: 500 }}>
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
