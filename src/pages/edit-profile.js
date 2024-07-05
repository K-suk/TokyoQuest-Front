// // import { useEffect, useState } from 'react';
// // import { useRouter } from 'next/router';
// // import { getProfile, updateProfile } from '/services/api';

// // const EditProfile = () => {
// //     const [profile, setProfile] = useState({
// //         first_name: '',
// //         last_name: '',
// //         contact_address: '',
// //         level: '',
// //         done: false,
// //         due: '',
// //     });
// //     const [isLoading, setIsLoading] = useState(true);
// //     const router = useRouter();

// //     useEffect(() => {
// //         const fetchProfile = async () => {
// //             try {
// //                 const profileData = await getProfile();
// //                 setProfile(profileData);
// //                 setIsLoading(false);
// //             } catch (error) {
// //                 if (error.response && error.response.status === 401) {
// //                     router.push('/login');
// //                 } else {
// //                     console.error('Error fetching profile:', error);
// //                 }
// //             }
// //         };

// //         fetchProfile();
// //     }, []);

// //     const handleChange = (e) => {
// //         const { name, value, type, checked } = e.target;
// //         setProfile((prevProfile) => ({
// //             ...prevProfile,
// //             [name]: type === 'checkbox' ? checked : value,
// //         }));
// //     };

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         try {
// //             await updateProfile(profile);
// //             router.push('/profile'); // プロフィールページにリダイレクト
// //         } catch (error) {
// //             console.error('Error updating profile:', error);
// //         }
// //     };

// //     if (isLoading) {
// //         return <div>Loading...</div>;
// //     }

// //     return (
// //         <form onSubmit={handleSubmit}>
// //             <h1>Edit Profile</h1>
// //             <div>
// //                 <label>First Name</label>
// //                 <input
// //                     type="text"
// //                     name="first_name"
// //                     value={profile.first_name}
// //                     onChange={handleChange}
// //                 />
// //             </div>
// //             <div>
// //                 <label>Last Name</label>
// //                 <input
// //                     type="text"
// //                     name="last_name"
// //                     value={profile.last_name}
// //                     onChange={handleChange}
// //                 />
// //             </div>
// //             <div>
// //                 <label>Contact Address</label>
// //                 <input
// //                     type="text"
// //                     name="contact_address"
// //                     value={profile.contact_address}
// //                     onChange={handleChange}
// //                 />
// //             </div>
// //             <button type="submit">Save</button>
// //         </form>
// //     );
// // };

// // export default EditProfile;

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { getProfile, updateProfile } from '/services/api';
// import styles from '../styles/profile.module.css';

// const EditProfile = () => {
//     const [profile, setProfile] = useState({
//         first_name: '',
//         last_name: '',
//         contact_address: '',
//         level: '',
//         done: false,
//         due: '',
//     });
//     const [isLoading, setIsLoading] = useState(true);
//     const router = useRouter();

//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {
//                 const profileData = await getProfile();
//                 setProfile(profileData);
//                 setIsLoading(false);
//             } catch (error) {
//                 if (error.response && error.response.status === 401) {
//                     router.push('/login');
//                 } else {
//                     console.error('Error fetching profile:', error);
//                 }
//             }
//         };

//         fetchProfile();
//     }, []);

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setProfile((prevProfile) => ({
//             ...prevProfile,
//             [name]: type === 'checkbox' ? checked : value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await updateProfile(profile);
//             router.push('/profile'); // プロフィールページにリダイレクト
//         } catch (error) {
//             console.error('Error updating profile:', error);
//         }
//     };

//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <>
//             <style jsx global>{`
//                 body {
//                     background: rgb(99, 39, 120);
//                 }
//             `}</style>
//             <div className="container rounded bg-white mt-5 mb-5">
//                 <form onSubmit={handleSubmit}>
//                     <div className="row">
//                         <div className="col-md-3 border-right">
//                             <div className="d-flex flex-column align-items-center text-center p-3 py-5">
//                                 <img className="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" alt="Profile" />
//                                 <span className="font-weight-bold">{profile.first_name} {profile.last_name}</span>
//                                 <span className="text-black-50">{profile.email}</span>
//                             </div>
//                         </div>
//                         <div className="col-md-5 border-right">
//                             <div className="p-3 py-5">
//                                 <div className="d-flex justify-content-between align-items-center mb-3">
//                                     <h4 className="text-right">Edit Profile</h4>
//                                 </div>
//                                 <div className="row mt-2">
//                                     <div className="col-md-6"><label className={`labels ${styles.labels}`}>First Name</label><input type="text" className="form-control" name="first_name" value={profile.first_name} onChange={handleChange} /></div>
//                                     <div className="col-md-6"><label className={`labels ${styles.labels}`}>Last Name</label><input type="text" className="form-control" name="last_name" value={profile.last_name} onChange={handleChange} /></div>
//                                 </div>
//                                 <div className="row mt-3">
//                                     <div className="col-md-12"><label className={`labels ${styles.labels}`}>Contact Address</label><input type="text" className="form-control" name="contact_address" value={profile.contact_address} onChange={handleChange} /></div>
//                                 </div>
//                                 <div className="mt-5 text-center"><button className={`btn btn-primary profile-button ${styles.profileButton}`} type="submit">Save Profile</button></div>
//                             </div>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </>
//     );
// };

// export default EditProfile;

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getProfile, updateProfile } from '/services/api';
import DOMPurify from 'dompurify';
import styles from '../styles/profile.module.css';

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
        const sanitizedValue = type === 'checkbox' ? checked : DOMPurify.sanitize(value);
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: sanitizedValue,
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
        <>
            <style jsx global>{`
                body {
                    background: rgb(99, 39, 120);
                }
            `}</style>
            <div className="container rounded bg-white mt-5 mb-5">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-3 border-right">
                            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                                <Image
                                    className="rounded-circle mt-5"
                                    width={150}
                                    height={150}
                                    src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                                    alt="Profile"
                                />
                                <span className="font-weight-bold">{profile.first_name} {profile.last_name}</span>
                                <span className="text-black-50">{profile.email}</span>
                            </div>
                        </div>
                        <div className="col-md-5 border-right">
                            <div className="p-3 py-5">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="text-right">Edit Profile</h4>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6"><label className={`labels ${styles.labels}`}>First Name</label><input type="text" className="form-control" name="first_name" value={profile.first_name} onChange={handleChange} /></div>
                                    <div className="col-md-6"><label className={`labels ${styles.labels}`}>Last Name</label><input type="text" className="form-control" name="last_name" value={profile.last_name} onChange={handleChange} /></div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-12"><label className={`labels ${styles.labels}`}>Contact Address</label><input type="text" className="form-control" name="contact_address" value={profile.contact_address} onChange={handleChange} /></div>
                                </div>
                                <div className="mt-5 text-center"><button className={`btn btn-primary profile-button ${styles.profileButton}`} type="submit">Save Profile</button></div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditProfile;