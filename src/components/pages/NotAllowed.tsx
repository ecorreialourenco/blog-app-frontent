import { FC } from "react";

const NotAllowed: FC = () => {
  return (
    <div>
      <div>
        <h1 className="next-error-h1">403</h1>
        <div>
          <h2>You don't have permissions to see this page</h2>
        </div>
      </div>
    </div>
  );
};

export default NotAllowed;
