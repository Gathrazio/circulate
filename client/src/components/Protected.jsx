import { Navigate } from 'react-router-dom';

export default function Protected ({token, children, redirectTo}) {
    return token ? children: <Navigate to={redirectTo}/>;
}