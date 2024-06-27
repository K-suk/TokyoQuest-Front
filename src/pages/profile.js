import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getProfile } from '/services/api';
import LogoutButton from 'components/LogoutButton';
import Link from 'next/link';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await getProfile();
                setProfile(profileData);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    router.push('/login');
                } else {
                    console.error('Error fetching profile:', error);
                }
            }
        };

        fetchProfile();
    }, []);

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Profile</h1>
            <p><strong>Account ID:</strong> {profile.account_id}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>First Name:</strong> {profile.first_name}</p>
            <p><strong>Last Name:</strong> {profile.last_name}</p>
            <p><strong>Contact Address:</strong> {profile.contact_address}</p>
            <p><strong>Level:</strong> {profile.level}</p>
            <p><strong>Done:</strong> {profile.done ? 'Yes' : 'No'}</p>
            <p><strong>Due:</strong> {profile.due}</p>
            <LogoutButton />
            <Link href="/edit-profile">
                <p>Edit Profile</p>
            </Link>
            <br />
            <Link href="/change-password">
                <p>Change Password</p>
            </Link>
            <br />
            <Link href="/">
                <p>Back to Home</p>
            </Link>
        </div>
    );
};

export default Profile;