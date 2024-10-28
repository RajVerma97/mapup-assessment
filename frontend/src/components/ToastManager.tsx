import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ToastStatus = "success" | "error" | "info" | "warning";

const notify = ({
  status,
  message,
}: {
  status: ToastStatus;
  message: string;
}) => {
  toast[status](message, {
    position: "top-right",
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const ToastManager = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      pauseOnFocusLoss
      newestOnTop={false}
      rtl={false}
      theme="light"
    />
  );
};

export { notify, ToastManager };
