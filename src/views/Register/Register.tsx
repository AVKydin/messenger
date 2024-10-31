import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { createUserByUsername, getUserByUsername } from '../../services/users.services';
import { createUser } from '../../services/auth.services';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import AppContext from '../../providers/AppContext';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';

const Register = (): JSX.Element => {
    const { setIsDetailedChatClicked } = useContext(AppContext);

    const [regDetails, setRegDetails] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const updateForm = (prop: string) => (e: React.FormEvent<HTMLInputElement>) => {
        setRegDetails({
            ...regDetails,
            [prop]: e.currentTarget.value,
        });
    };

    const register: React.FormEventHandler<HTMLFormElement> = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (regDetails.password !== regDetails.confirmPassword) {
            return toast.warning('Passwords do not match!');
        }

        if (!Number.isNaN(Number(regDetails.phoneNumber)) === false) {
            return toast.warning('The entered phone number is not valid.');
        }

        getUserByUsername(regDetails.username)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    toast.warning(`The username ${regDetails.username} already exists!`);
                } else {
                    return createUser(regDetails.email, regDetails.password)
                        .then((u) => {
                            createUserByUsername(regDetails.firstName, regDetails.lastName,
                                regDetails.phoneNumber, regDetails.username, u.user.email, u.user.uid)
                                .then(() => {
                                    setIsDetailedChatClicked(false);
                                    toast.success('Successful sign up!');
                                })
                                .catch(console.error);
                        })
                        .catch((event) => {
                                if (event.message.includes('email-already-in-use')) {
                                    toast.warning(`The e-mail ${regDetails.email} is already in use!`);
                                } else if (event.message.includes('invalid-email')) {
                                    toast.warning(`The e-mail ${regDetails.email} is invalid`);
                                } else if (event.message.includes('weak-password')) {
                                    toast.warning('The password is too weak! Please use a password with at least 6 characters.');
                                } else {
                                    toast.warning(event.message);
                                }
                            },
                        );
                }
            })
            .catch(console.error);
    };

    return (
        <div id='home-page'>

        <div id='register-div'>
        <form id="register-form" onSubmit={register}>
    <h4 id="sign-up">Sign up</h4>
    <label htmlFor="first-name">First Name:</label>
    <br />
    <input type="text" className="register-field" name="first-name" placeholder="first name" required value={regDetails.firstName} onChange={updateForm('firstName')} />
    <br />
    <label htmlFor="last-name">Last Name:</label>
    <br />
    <input type="text" className="register-field" name="last-name" placeholder="last name" required value={regDetails.lastName} onChange={updateForm('lastName')} />
    <br />
    <label htmlFor="phone-number">Phone number:</label>
    <br />
    <input type="tel" className="register-field" name="phone-number" placeholder="phone number" required value={regDetails.phoneNumber} onChange={updateForm('phoneNumber')} />
    <br />
    <label htmlFor="username">Username:</label>
    <br />
    <input type="text" className="register-field" name="username" placeholder="username" required value={regDetails.username} onChange={updateForm('username')} />
    <br />
    <label htmlFor="email">E-mail:</label>
    <br />
    <input type="email" className="register-field" name="email" placeholder="e-mail" required value={regDetails.email} onChange={updateForm('email')} />
    <br />
    <label htmlFor="password">Password:</label>
    <br />
    <input type="password" className="register-field" name="password" placeholder="password" required value={regDetails.password} onChange={updateForm('password')} />
    <br />
    <label htmlFor="confirm-password">Confirm Password:</label>
    <br />
    <input type="password" className="register-field" name="confirm-password" placeholder="confirm-password" required value={regDetails.confirmPassword} onChange={updateForm('confirmPassword')} />

    <h3 id='already-have-acc'>Already have an account?
        <Link to={'/login'}>
        <span id="sign-in-btn"> Sign in</span>
            </Link>
            </h3>
            <button id="sign-up-btn">Sign up</button>
    </form>
    </div>
    <ToastContainer
    autoClose={2000}
        ></ToastContainer>
        </div>
);
};

export default Register;
