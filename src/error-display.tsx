import {getErrorString} from "./utils.ts";

interface ErrorDisplayProps {
  error: unknown;
  message: string;
}

export const ErrorDisplay = ({ error, message }: ErrorDisplayProps) => {
  if (!error) {
    return null
  }

  return <div>
    <p>{message}</p>
    <pre style={{whiteSpace: "stable"}}><code>{getErrorString(error)}</code></pre>
  </div>
}
