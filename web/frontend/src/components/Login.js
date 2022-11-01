import React, { useState } from 'react';
import { sendRequest } from '../common/Requests';

function Login() {
    const doLogin = async event => {
        sendRequest('login', (res) => {
            console.log(res);
        });
    };

    return (
        <main className='flex bg-orange-200 h-minus-header'>
            <div className='grid container m-auto min-h-1/3 bg-yellow-200 place-items-center flex-1'
                id='loginDiv'>
                <form onSubmit={doLogin}>
                    <span id='inner-title'>Please Log In</span><br />
                    <input className='mt-5 px-2' type='text' id='loginName' placeholder='Username'
                        ref={(c) => loginName = c} /><br />
                    <input className='mt-5 mb-5 px-2' type='password' id='loginPassword' placeholder='Password'
                        ref={(c) => loginPassword = c} /><br />
                    <input type='submit' id='loginButton' className='w-40 bg-red-500' value='Log in'
                        onClick={doLogin} />
                </form>
                <span id='loginResult'>{message}</span>
            </div>
        </main>
    );
};
export default Login;