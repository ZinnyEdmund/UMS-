import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { addUser, updateUser, fetchUsers } from '../store/UserSlice';
import { User } from '../store/UserSlice';


interface FormData {
    name: string;
    email: string;
    phone: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
    };
}

const UserForm: React.FC = () => {
    const { id } = useParams<{ id? : string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isEditMode = Boolean(id);

    const { users, status } = useAppSelector((state) => state.users);
    const userToEdit = isEditMode ? users.find((user:  User) => user.id === Number(id)) : null;

    const [ formData, setFormData ] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        address: {
            street: '',
            suite: '',
            city: '',
            zipcode: '',
        },
    });

    const [errors, setErrors] = useState<Partial<{
        name: string;
        email: string;
        'address.street': string;
        'address.city': string;
        'address.zipcode': string;
    }>>({});

    useEffect(() => {
        // If we don't have any users yet and we are edit mode, fetch them
        if (isEditMode && status === 'idle'){
            dispatch(fetchUsers());
        }
    }, [isEditMode, status, dispatch]);

    useEffect(() => {
        // Populate form with user data if in edit mode and user exists
        if (isEditMode && userToEdit){
            setFormData({
                name: userToEdit.name,
                email: userToEdit.email,
                phone: userToEdit.phone || '',
                address: {
                    street: userToEdit.address.street,
                    suite: userToEdit.address.suite || '',
                    city: userToEdit.address.city,
                    zipcode: userToEdit.address.zipcode || ''
                },

            });
        }
    }, [isEditMode, userToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

            // Handles nested address filed
            if (name.startsWith('address.')) {
                const addressField = name.split('.')[1];
                setFormData({...formData, address: {
                    ...formData.address,
                [addressField]: value,
            },
        });
    } else {
        // Handle the top level fields
        setFormData({
            ...formData,
            [name]: value,
        });
    }
};

    const validate = (): boolean => {
        const newErrors: Partial<{
            name: string;
            email: string;
            'address.street': string;
            'address.city': string;
        }> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Enter your name';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Enter your email';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._%+-]+[a-zA-Z]{2,}$/.test(formData.email)) {
            newErrors.email = 'Enter a valid email';
        }
        if (!formData.address.street.trim()) {
            newErrors['address.street'] = 'Street is required!';
        }
        if (!formData.address.city.trim()) {
            newErrors['address.city'] = 'City is required!';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        if (isEditMode && userToEdit) {
            // Update existing user
            dispatch(updateUser({
                id: userToEdit.id,
                ...formData,} as User));
        } else {
            // Add new user
            dispatch(addUser(formData));
        }

        // Navigate back to user list
        navigate('/users');
    };

    if (isEditMode && status === 'loading...') {
        return <div>Loading...</div>;
    }
    if (isEditMode && !userToEdit && status === 'loading...') {
        return <div>User not found!</div>;
    }

    return (
        <div className="user-profile-container">
            <div className="user-profile-form">
                <h2>{isEditMode ? 'Edit User' : 'Add New User'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="name" placeholder='Enter your name' value={formData.name} onChange={handleChange}/>
                        {errors.name && <p className="error-message">{errors.name}</p>}
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="text" name="email" placeholder='Enter your email' value={formData.email} onChange={handleChange}/>
                        {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>

                    <div className="form-group">
                        <label>Phone (Optional)</label>
                        <input type="text" name="phone" placeholder='Enter your phone number' value={formData.phone} onChange={handleChange}/>
                    </div>

                        <h3>Address</h3>

                    <div className="form-group">
                        <label>Street</label>
                        <input type="text" name="address.street" placeholder='Enter your street' value={formData.address.street} onChange={handleChange}/>
                        {errors['address.street'] && ( <p className="error-message">{errors['address.street']}</p> )}
                    </div>

                    <div className="form-group">
                        <label>Suite (Optional)</label>
                        <input type="text" name="address.suite" placeholder='Enter your suite' value={formData.address.suite} onChange={handleChange}/>
                    </div>

                    <div className="form-group">
                        <label>City</label>
                        <input type="text" name="address.city" placeholder='Enter your city' value={formData.address.city} onChange={handleChange}/>
                        {errors['address.city'] && ( <p className="error-message">{errors['address.city']}</p> )}
                    </div>

                    <div className="form-group">
                        <label>Zipcode (Optional)</label>
                        <input type="text" name="address.zicode" placeholder='Enter your zipcode' value={formData.address.zipcode} onChange={handleChange}/>
                    </div>

                    <div className="button-group">
                        <button type='submit' className="btn-primary">{isEditMode ? 'Update User' : 'Add User'}</button>
                        <button type='button' onClick={() => navigate('/users')} className="btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default UserForm;