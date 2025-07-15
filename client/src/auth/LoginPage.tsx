// import { useAuth0 } from '@auth0/auth0-react';

// const LoginPage = () => {
//  const { loginWithRedirect } = useAuth0();

//   return (
//     <div>
//       <button onClick={() => loginWithRedirect()}>Log In</button>
//     </div>
//   );

// };

// export default LoginPage;

import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    loginWithRedirect();
  }, [loginWithRedirect]);

  return (
    <div>
      <p>Redirecting to login...</p>
    </div>
  );
};

export default LoginPage;
