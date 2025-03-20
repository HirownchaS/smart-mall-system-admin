import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import Swal from 'sweetalert2';

function Register({ handleShowLogin }) {
  // Define the validation schema using yup
  const validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    username: yup.string().required('Username is required').min(5),
    password: yup.string().required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password')
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data) => {
    // Remove confirmPassword from data before sending to the server
    const { confirmPassword, ...formData } = data;

    axios.post('http://localhost:8080/api/user/register', formData)
      .then((response) => {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Your account has been created!',
          confirmButtonText: 'OK'
        }).then(() => {
          window.location.reload(); 
        });
        console.log('Registration successful:', response.data);
        
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text:  error.message,
          confirmButtonText: 'Try Again'
        });
        console.error('Registration failed:', error.response?.data || error.message);
         
      });
  };

  return (
    <div>
      <h2 className='text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100'>
        Register
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
        <input
          id='email'
          type='email'
          placeholder='Email'
          {...register('email')}
          className='mb-4 p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'
        />
        {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
        
        <input
          id='username'
          type='text'
          placeholder='Username'
          {...register('username')}
          className='mb-4 p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'
        />
        {errors.username && <p className='text-red-500'>{errors.username.message}</p>}
        
        <input
          id='password'
          type='password'
          placeholder='Password'
          {...register('password')}
          className='mb-4 p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'
        />
        {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
        
        <input
          id='confirm-password'
          type='password'
          placeholder='Re-enter Password'
          {...register('confirmPassword')}
          className='mb-4 p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'
        />
        {errors.confirmPassword && <p className='text-red-500'>{errors.confirmPassword.message}</p>}
        
        <button
          type='submit'
          className='bg-blue-500 dark:bg-blue-700 text-white p-2 rounded hover:bg-blue-600 dark:hover:bg-blue-600 w-full'
        >
          Register
        </button>
        
        <div className='mt-4 text-center'>
          <p className='text-gray-700 dark:text-gray-300'>
            Already have an account?{' '}
            <button
              onClick={handleShowLogin}
              className='text-blue-500 dark:text-blue-400 underline'
            >
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;
