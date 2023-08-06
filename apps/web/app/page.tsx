'use client';

import { ExclamationCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import { Alert, Anchor, Button, Group, PasswordInput, TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { IconDatabase } from '@tabler/icons-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { AuthForm } from './_types';
import RootLayout from './layout';

const StyledPage = styled.div`
  .page {
  }
`;

// validation
const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('No email provided'),
  password: Yup.string().required('No password provided').min(5, 'Password should be min 5 chars'),
});

export default async function Index() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const form = useForm<AuthForm>({
    validate: yupResolver(schema),
    initialValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async () => {
    try {
      if (isRegister) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
          emai: form.values.email,
          password: form.values.password
        });
      }
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        emai: form.values.email,
        password: form.values.password
      });
      form.reset();
      router.push('/dashboard');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.response.data.message);
    }
  };

  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.styled-components file.
   */
  return (
    <StyledPage>
      <RootLayout title='Auth'>
        <ShieldCheckIcon className='h-16 w-16 text-blue-500' />
        {error && (
          <Alert
            my='md'
            variant='filled'
            icon={<ExclamationCircleIcon />}
            title='Authorization Error'
            color='red'
            radius='md'
          >
            {error}
          </Alert>
        )}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            mt='md'
            id='email'
            label='Email*'
            placeholder='example@gmail.com'
            {...form.getInputProps('email')}
          />
          <PasswordInput
            mt='md'
            id='password'
            label='Password*'
            placeholder='example@gmail.com'
            description='Must be min 5 char'
            {...form.getInputProps('password')}
          />
          <Group mt='xl' position='apart'>
            <Anchor
              component='button'
              type='button'
              size='xs'
              className='text-gray-300'
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
            >
              {isRegister
                ? 'Have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            <Button
              leftIcon={<IconDatabase size={14} />}
              color='cyan'
              type='submit'
            >
              {isRegister ? 'Register' : 'Login'}
            </Button>
          </Group>
        </form>
      </RootLayout>
    </StyledPage>
  );
};