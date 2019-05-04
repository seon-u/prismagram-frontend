import React, { useState } from 'react';
import AuthPresenter from './AuthPresenter';
import useInput from '../../Hooks/useInput';
import { useMutation } from 'react-apollo-hooks';
import { LOG_IN, CREATE_ACCOUNT } from './AuthQueries';
import { toast } from 'react-toastify';

export default () => {
    const [action, setAction] = useState('logIn');
    const username = useInput('');
    const firstName = useInput('');
    const lastName = useInput('');
    const email = useInput('');
    
    const requestSecretMutation = useMutation(LOG_IN, {
        variables : {
            // useInput은 value와 onChange를 주기 때문에 값을 가져오려면 .value를 해줘야 한다.
            email : email.value
        } 
    });

    const createAccountMutation = useMutation(CREATE_ACCOUNT, {
        variables : {
            email : email.value,
            username : username.value,
            firstName : firstName.value,
            lastName : lastName.value
        }
    });

    const onSubmit = async (e) => {
        e.preventDefault();

        if(action === 'logIn') {
            if(email.value !== '') {
                try {
                    const { requestSecret } = await requestSecretMutation();
                    
                    if(!requestSecret) {
                        toast.error('You dont have an account yet, create one');
                        setTimeout(() => setAction('signUp'), 3000);
                    }
                } catch(err) {
                    console.log('AuthContainer.js onSubmit requestSecret error : ', err);
                    toast.error(`Can't request secret, try again`);
                }
            } else {
                toast.error('Email is required');
            }
        } else if(action === 'signUp') {
            if(email.value !== '' && username.value !== '' && firstName.value !== '' && lastName.value !== '') {
                try {
                    const { createAccount } = await createAccountMutation();

                    if(!createAccount) {
                        toast.error(`Can't create account`);
                    } else {
                        toast.success('Account created! Log In now');
                        setTimeout(() => setAction('logIn'), 3000);
                    }
                } catch(err) {
                    console.log('AuthContainer.js onSubmit createAccount error : ', err);
                    toast.error(e.message);
                }
            } else {
                toast.error('All field are required');
            }
        }
    };

    return <AuthPresenter setAction={ setAction } action={ action } username={ username }
        firstName={ firstName } lastName={ lastName } email={ email } onSubmit={ onSubmit } />;
};