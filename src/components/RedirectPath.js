import React from 'react';
import { Redirect } from 'react-router-dom';

function RedirectPath ({isAuthorized}) {
    if (isAuthorized) {
        return (
            <Redirect path='/' to='/main' />
        )
    } else {
        return (
            <Redirect path='/' to='/login' />
        )
    }
}

export default RedirectPath