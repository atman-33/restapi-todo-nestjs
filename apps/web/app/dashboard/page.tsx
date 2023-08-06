import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import RootLayout from '../layout';

const Dashboard: NextPage = () => {
    const router = useRouter();

    const logout = async () => {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`);
        router.push('/');
    };

    return (
        <RootLayout title='Task Board'>
            <ArrowRightOnRectangleIcon
                className='mb-6 h-6 w-6 cursor-pointer text-blue-500'
                onClick={logout}
            />
        </RootLayout>
    );
};

export default Dashboard;