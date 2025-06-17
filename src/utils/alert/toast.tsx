import { toast } from "react-toastify";

export const showToast = (
  message: string,
  type: "success" | "error" | "info" | "warning" = "info",
  duration = 3000,
) => {
  toast.dismiss();
  switch (type) {
    case "success":
      toast.success(message, {
        style: {
          backgroundColor: "black",
          color: "white",
        },
        autoClose: duration,
      });
      break;
    case "error":
      toast.error(message);
      break;
    case "info":
      toast.info(message, {
        style: {
          backgroundColor: "black",
          color: "white",
        },
        autoClose: duration,
        position:'bottom-right'
      });
      break;
    case "warning":
      toast.warn(message, {
        style: {
          backgroundColor: "black",
          color: "white",
        },
        autoClose: duration,
      });
      break;
    default:
      toast(message);
  }
};
