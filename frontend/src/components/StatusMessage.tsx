import "./StatusMessage.css";

type Props = {
  statusMessage: string | null;
};

const StatusMessage: React.FC<Props> = ({ statusMessage }) => {
  return (
    <>{statusMessage && <p className="status-message">{statusMessage}</p>}</>
  );
};

export default StatusMessage;
