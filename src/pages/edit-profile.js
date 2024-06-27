import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getProfile, updateProfile } from '/services/api';

const EditProfile = () => {
    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        contact_address: '',
        level: '',
        done: false,
        due: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await getProfile();
                setProfile(profileData);
                setIsLoading(false);
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(profile);
            router.push('/profile'); // プロフィールページにリダイレクト
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Edit Profile</h1>
            <div>
                <label>First Name</label>
                <input
                    type="text"
                    name="first_name"
                    value={profile.first_name}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Last Name</label>
                <input
                    type="text"
                    name="last_name"
                    value={profile.last_name}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Contact Address</label>
                <input
                    type="text"
                    name="contact_address"
                    value={profile.contact_address}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Save</button>
        </form>
    );
};

export default EditProfile;