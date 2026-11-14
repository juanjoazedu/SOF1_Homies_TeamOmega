interface ToastProps {
  message: string;
}

export const Toast = ({ message }: ToastProps) => (
  <div className="toast" role="status">{message}</div>
);